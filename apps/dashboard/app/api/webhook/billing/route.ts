import { createHmac, timingSafeEqual } from "node:crypto";
import { db, Profiles } from "@repo/db";
import { Subscriptions } from "@repo/db/schema/subscriptions.sql";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { type BillingWebhookPayload, BillingWebhookPayloadSchema } from "@/lib/schemas/billing";

export async function POST(request: Request) {
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });

  const headersList = await headers();
  const signatureHeader = headersList.get("x-signature") || "";

  const text = await request.text();
  const hmac = createHmac("sha256", secret);
  const digest = Buffer.from(hmac.update(text).digest("hex"), "utf8");
  const signature = Buffer.from(signatureHeader, "utf8");

  if (digest.length !== signature.length || !timingSafeEqual(digest, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const parseResult = BillingWebhookPayloadSchema.safeParse(JSON.parse(text));

  if (!parseResult.success) {
    console.error("Invalid webhook payload:", parseResult.error);
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const payload = parseResult.data;
  const eventName = payload.meta.event_name;

  try {
    console.log("Processing webhook event:", eventName);

    switch (eventName) {
      case "subscription_created":
      case "subscription_updated":
      case "subscription_resumed":
        await handleSubscriptionChange(payload);
        break;

      case "subscription_expired":
        await handleSubscriptionEnd(payload);
        break;
    }
  } catch (error) {
    console.error("Webhook processing failed:", error);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function handleSubscriptionChange(payload: BillingWebhookPayload) {
  const { data, meta } = payload;
  const { id, attributes } = data;
  const userId = meta.custom_data.user_id;
  const interval = meta.custom_data.interval;
  const variantId = attributes.variant_id;
  const customerId = attributes.customer_id;
  const renewsAt = attributes.renews_at;

  if (!userId) {
    console.error("No user_id found in custom_data");
    return;
  }

  await db
    .insert(Subscriptions)
    .values({
      userId: userId,
      provider: "lemon-squeezy",
      customerId: customerId,
      subscriptionId: id,
      priceId: variantId,
      interval: interval,
      currentPeriodEnd: new Date(renewsAt),
    })
    .onConflictDoUpdate({
      target: Subscriptions.userId,
      set: {
        subscriptionId: id,
        priceId: variantId,
        interval: interval,
        currentPeriodEnd: new Date(renewsAt),
        updatedAt: new Date(),
      },
    });

  await db.update(Profiles).set({ tier: "pro" }).where(eq(Profiles.id, userId));
}

async function handleSubscriptionEnd(payload: BillingWebhookPayload) {
  const data = payload.data;
  const subscriptionId = data.id;

  const sub = await db.query.Subscriptions.findFirst({
    where: eq(Subscriptions.subscriptionId, subscriptionId),
  });

  if (!sub) return;

  await db.update(Profiles).set({ tier: "free" }).where(eq(Profiles.id, sub.userId));
  await db.delete(Subscriptions).where(eq(Subscriptions.id, sub.id));
}
