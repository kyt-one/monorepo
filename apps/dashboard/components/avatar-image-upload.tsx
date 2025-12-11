"use client";

import { Avatar, AvatarFallback, AvatarImage, Button } from "@repo/ui";
import { shortId } from "@repo/utils";
import { Loader2, UploadCloud, X } from "lucide-react";
import { useRef, useState } from "react";
import { Else, If, Then } from "react-if";
import { createClient } from "@/lib/utils/supabase/client";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

export function AvatarImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${shortId()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

      onChange(data.publicUrl);
    } catch (_error) {
      alert("Error uploading image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    onChange("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-20 w-20 border">
        <AvatarImage src={value || undefined} className="object-cover" />
        <AvatarFallback className="bg-muted">
          <If condition={isUploading}>
            <Then>
              <Loader2 className="size-6 animate-spin" />
            </Then>
            <Else>IMG</Else>
          </If>
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={disabled || isUploading}
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadCloud className="mr-2 size-4" />
            <If condition={isUploading}>
              <Then>Uploading...</Then>
              <Else>Upload Image</Else>
            </If>
          </Button>

          <If condition={!!value}>
            <Then>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleRemove}
                disabled={disabled || isUploading}
              >
                <X className="size-4 text-muted-foreground" />
              </Button>
            </Then>
          </If>
        </div>
        <p className="text-xs text-muted-foreground">Recommended: Square JPG or PNG, max 2MB.</p>

        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleUpload}
          disabled={disabled || isUploading}
        />
      </div>
    </div>
  );
}
