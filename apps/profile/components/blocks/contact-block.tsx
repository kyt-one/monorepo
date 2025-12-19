"use client";

import type { ContactBlockData } from "@repo/db";
import { Button, toast } from "@repo/ui";
import { Copy, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { When } from "react-if";
import { useCopyToClipboard } from "usehooks-ts";
import { getCreatorEmailAction, trackInteractionAction } from "@/app/[...slug]/actions";

interface Props {
  kitId: string;
  profileId: string;
  data: ContactBlockData;
  className?: string;
}

export function ContactBlock({ kitId, profileId, data, className }: Props) {
  const [email, setEmail] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [_, copy] = useCopyToClipboard();

  const handleReveal = () => {
    if (email) return;

    trackInteractionAction(kitId, "contact_click", { target: "email_reveal" });

    startTransition(async () => {
      const result = await getCreatorEmailAction(profileId);
      if (result.email) setEmail(result.email);
    });
  };

  const handleCopy = () => {
    copy(email);
    toast.success("Email copied to clipboard");
  };

  if (email) {
    return (
      <div className="flex gap-2 w-full animate-in fade-in zoom-in duration-300">
        <Link
          href={`mailto:${email}`}
          className={`flex items-center justify-center gap-1.5 flex-1 ${className}`}
        >
          <Mail size={20} />
          <span>{email}</span>
        </Link>
        <Button
          size="icon"
          variant="outline"
          className="aspect-square h-12 w-12 shrink-0 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 rounded-(--radius)"
          onClick={handleCopy}
        >
          <Copy className="size-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button className={className} onClick={handleReveal} disabled={isPending}>
      <When condition={isPending}>
        <Loader2 className="mr-2 size-4 animate-spin" />
      </When>
      <When condition={!isPending}>{data.buttonText}</When>
    </Button>
  );
}
