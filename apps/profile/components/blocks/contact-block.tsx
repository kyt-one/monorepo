"use client";

import type { ContactBlockData } from "@repo/db";
import { toast } from "@repo/ui";
import Image from "next/image";
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
    <div className="group relative w-full overflow-hidden rounded-4xl bg-[#f0d1b2] p-8 text-left transition-all duration-500 hover:-translate-y-1">
      <button type="button" className="absolute inset-0 z-0 cursor-pointer" onClick={onClick} />

      <div className="absolute right-0 bottom-0 top-0 w-88 pointer-events-none">
        <div className="absolute inset-0 z-10 bg-linear-to-r from-[#f0d1b2] to-transparent" />
        <Image
          src="/images/contact-illustration.png"
          alt="Contact illustration"
          fill
          className="object-cover mix-blend-luminosity opacity-70"
          priority
        />
      </div>
      <div
        className="absolute inset-0 opacity-[0.03] z-0 pointer-events-none mix-blend-multiply"
        style={{
          backgroundImage: `url("/images/patterns/pattern-1.svg")`,
          backgroundRepeat: "repeat",
          backgroundSize: "5%",
        }}
      />

      <div className="relative z-10 flex flex-col justify-between h-full min-h-[140px] pointer-events-none">
        <div className="text-[10px] font-bold uppercase tracking-widest text-[#8D7F71]">
          <If condition={email}>
            <Then>
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                SAY HELLO
              </div>
            </Then>
            <Else>
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                Contact Info
              </div>
            </Else>
          </If>
        </div>

        <div className="mt-4">
          <If condition={email}>
            <Then>
              <div className="flex flex-col gap-3.5 animate-in fade-in slide-in-from-bottom-2 duration-300 pointer-events-auto">
                <Link
                  href={`mailto:${email}`}
                  className="font-serif font-semibold text-3xl text-[#3E2723] hover:underline"
                >
                  {email}
                </Link>

                <div className="flex gap-4">
                  <button
                    onClick={handleCopy}
                    type="button"
                    className="text-xs font-bold uppercase tracking-widest text-[#8D7F71] hover:text-[#3E2723] hover:underline transition-colors"
                  >
                    [ Copy Email ]
                  </button>
                  <Link
                    href={`mailto:${email}`}
                    className="text-xs font-bold uppercase tracking-widest text-[#8D7F71] hover:text-[#3E2723] hover:underline transition-colors"
                  >
                    [ Send Message ]
                  </Link>
                </div>
              </div>
            </Then>

            <Else>
              <span className="font-serif font-semibold text-5xl text-[#3E2723] transition-colors">
                <If condition={isPending}>
                  <Then>
                    <div className="animate-in fade-in duration-400">Please wait...</div>
                  </Then>
                  <Else>{data.buttonText}</Else>
                </If>
              </span>
            </Else>
          </If>
        </div>
      </div>
    </div>
  );
}
