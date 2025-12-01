"use client";

import { Button, Input, Label } from "@repo/ui";
import { Check, Copy, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { When } from "react-if";
import { useCopyToClipboard } from "usehooks-ts";

interface Props {
  url: string;
}

export function CopyMediaKitLink({ url }: Props) {
  const [_, copy] = useCopyToClipboard();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await copy(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-2">
      <Label>Your Media Kit Link</Label>
      <div className="flex gap-2">
        <Input value={url} readOnly className="font-mono text-sm" />

        <Button variant="outline" size="icon" onClick={handleCopy}>
          <When condition={copied}>
            <Check className="size-4" />
          </When>
          <When condition={!copied}>
            <Copy className="size-4" />
          </When>
        </Button>

        <Button variant="secondary" size="icon" asChild>
          <Link href={url} target="_blank">
            <ExternalLink className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
