"use client";

import { Button } from "@repo/ui";
import { shortId } from "@repo/utils";
import { Loader2, UploadCloud, X } from "lucide-react";
import { useRef, useState } from "react";
import { Else, If, Then } from "react-if";
import { createClient } from "@/lib/utils/supabase/client";

interface BackgroundImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

export function BackgroundImageUpload({ value, onChange, disabled }: BackgroundImageUploadProps) {
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

      const { error: uploadError } = await supabase.storage
        .from("kit-block-backgrounds")
        .upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("kit-block-backgrounds").getPublicUrl(filePath);

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
    <div className="space-y-3">
      <If condition={!!value}>
        <Then>
          <div className="relative w-full h-32 rounded-lg overflow-hidden border">
            <img src={value} alt="Background preview" className="w-full h-full object-cover" />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              disabled={disabled || isUploading}
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
            >
              <X className="size-4" />
            </Button>
          </div>
        </Then>
      </If>

      <div className="flex flex-col gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={disabled || isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="w-full"
        >
          <If condition={isUploading}>
            <Then>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Uploading...
            </Then>
            <Else>
              <UploadCloud className="mr-2 size-4" />
              {value ? "Change Image" : "Upload Image"}
            </Else>
          </If>
        </Button>

        <p className="text-xs text-muted-foreground">Recommended: Landscape JPG or PNG, max 5MB.</p>

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
