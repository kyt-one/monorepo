import { AccountsDueForUpdate, db } from "@repo/db";
import { addMinutes, isBefore } from "date-fns";
import { google } from "googleapis";
import { NextResponse } from "next/server";
import { fetchAndSaveYouTubeStats } from "@/lib/services/youtube";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized: Invalid or missing CRON_SECRET",
      },
      { status: 401 }
    );
  }

  try {
    const accounts = await db.select().from(AccountsDueForUpdate);

    if (accounts.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No accounts due for update",
        data: [],
      });
    }

    const results = await Promise.allSettled(
      accounts.map(async (account) => {
        try {
          const oauth2Client = new google.auth.OAuth2(
            process.env.SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID,
            process.env.SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET
          );

          oauth2Client.setCredentials({
            refresh_token: account.refreshToken,
          });

          const now = new Date();
          const isExpired = !account.expiresAt || isBefore(account.expiresAt, addMinutes(now, 5));

          let accessToken = account.accessToken;
          let refreshToken = account.refreshToken;

          if (isExpired && account.refreshToken) {
            const { credentials } = await oauth2Client.refreshAccessToken();
            if (credentials.access_token) accessToken = credentials.access_token;
            if (credentials.refresh_token) refreshToken = credentials.refresh_token;
          }

          await fetchAndSaveYouTubeStats(account.userId, accessToken, refreshToken);

          return { userId: account.userId, status: "success" };
        } catch (error) {
          return {
            userId: account.userId,
            status: "failed",
            error: String(error),
          };
        }
      })
    );

    const _successCount = results.filter((r) => r.status === "fulfilled").length;

    return NextResponse.json({
      success: true,
      message: `Processed ${accounts.length} accounts.`,
      data: results,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: `Internal Server Error: ${String(error)}`,
      },
      { status: 500 }
    );
  }
}
