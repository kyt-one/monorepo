"use client";

import { Button, Input, Label, toast } from "@repo/ui";
import { Copy, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useCopyToClipboard } from "usehooks-ts";

interface Props {
  url: string;
}

export function CopyMediaKitLink({ url }: Props) {
  const [_, copy] = useCopyToClipboard();

  const handleCopy = async () => {
    await copy(url);
    toast.success("Link copied to clipboard");
  };

  return (
    <div className="space-y-2">
      <Label>Your Media Kit Link</Label>
      <div className="flex gap-2">
        <Input value={url} readOnly className="font-mono text-sm" />

        <Button variant="outline" size="icon" onClick={handleCopy}>
          <Copy className="size-4" />
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
