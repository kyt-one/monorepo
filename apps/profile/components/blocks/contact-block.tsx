"use client";

import type { ContactBlockData } from "@repo/db";
import { toast } from "@repo/ui";
import Link from "next/link";
import { useState, useTransition } from "react";
import { Else, If, Then } from "react-if";
import { useCopyToClipboard } from "usehooks-ts";
import { getCreatorEmailAction, trackInteractionAction } from "@/app/[...slug]/actions";

interface Props {
  kitId: string;
  profileId: string;
  data: ContactBlockData;
}

export function ContactBlock({ kitId, profileId, data }: Props) {
  const [email, setEmail] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [_, copy] = useCopyToClipboard();

  const onClick = () => {
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

  return (
    <div className="group cursor-pointer relative h-full w-full overflow-hidden rounded-4xl bg-linear-to-br from-[#4A3728] to-[#2E1F14] flex items-center justify-center text-center transition-all duration-500 hover:-translate-y-1">
      <button type="button" className="absolute inset-0 z-10" onClick={onClick} />
      <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle,rgba(212,165,116,0.2)_0%,transparent_70%)] blur-2xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-[radial-gradient(circle,rgba(212,165,116,0.15)_0%,transparent_70%)] blur-2xl" />

      <div className="relative z-10 px-8">
        <If condition={email}>
          <Then>
            <div className="animate-in fade-in zoom-in-95 duration-500 pointer-events-auto">
              <span className="block text-[10px] font-bold uppercase tracking-[0.3em] text-[#C4956A]/70 mb-4">
                Get in Touch
              </span>
              <Link
                href={`mailto:${email}`}
                className="font-serif italic text-5xl text-[#F5EBE0] hover:text-white transition-colors block mb-6"
              >
                {email}
              </Link>
              <div className="flex justify-center gap-6">
                <button
                  onClick={handleCopy}
                  type="button"
                  className="text-xs uppercase tracking-widest text-[#C4956A]/60 hover:text-[#F5EBE0] border-b border-transparent hover:border-[#F5EBE0] pb-1 transition-all"
                >
                  Copy
                </button>
                <Link
                  href={`mailto:${email}`}
                  className="text-xs uppercase tracking-widest text-[#C4956A]/60 hover:text-[#F5EBE0] border-b border-transparent hover:border-[#F5EBE0] pb-1 transition-all"
                >
                  Email
                </Link>
              </div>
            </div>
          </Then>
          <Else>
            <div className="space-y-2">
              <span className="block text-[10px] font-bold uppercase tracking-[0.3em] text-[#C4956A]/70">
                Contact
              </span>
              <span className="font-serif italic text-5xl text-[#F5EBE0] group-hover:text-white transition-all inline-block">
                <If condition={isPending}>
                  <Then>Loading ...</Then>
                  <Else>{data.buttonText}</Else>
                </If>
              </span>
            </div>
          </Else>
        </If>
      </div>
    </div>
  );
}
