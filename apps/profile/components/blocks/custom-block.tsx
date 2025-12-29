"use client";

import type { CustomBlockData } from "@repo/db";
import { getDefaultBlock } from "@repo/utils";
import { ArrowUpRight } from "lucide-react";
import { When } from "react-if";

interface Props {
  data: CustomBlockData;
}

const defaultCustomBlock = getDefaultBlock("custom") as CustomBlockData;

export function CustomBlock({ data }: Props) {
  const backgroundColor = data.backgroundColor || defaultCustomBlock.backgroundColor;
  const textColor = data.textColor || defaultCustomBlock.textColor;

  const isLink = !!data.link;
  const hasTitle = !!data.title;
  const hasImage = !!data.backgroundImage;

  const handleClick = () => {
    if (isLink) window.open(data.link, "_blank");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group relative w-full h-full aspect-square overflow-hidden text-white p-8 cursor-pointer text-left transition-all duration-500 hover:-translate-y-1 rounded-4xl"
      style={{
        backgroundColor,
        color: textColor,
      }}
    >
      <When condition={hasImage}>
        <div className="absolute inset-0 z-0">
          <img src={data.backgroundImage} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/20" />
        </div>
      </When>

      <div className="absolute inset-x-0 top-0 h-4 bg-black/10 flex items-center justify-between px-6 mt-4 rounded-full mx-4">
        <div className="flex gap-1">
          <div className="size-1 rounded-full bg-white/40" />
          <div className="size-1 rounded-full bg-white/40" />
        </div>
      </div>

      <div className="h-full flex flex-col justify-center relative z-10 gap-2">
        <When condition={hasTitle}>
          <h3 className="font-black text-5xl uppercase leading-[0.85] tracking-tighter wrap-break-word">
            {data.title}
          </h3>
        </When>

        <When condition={!!data.description}>
          <p className="font-mono text-xs opacity-80 leading-tight uppercase tracking-tight line-clamp-3">
            {data.description}
          </p>
        </When>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-12 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIyIiBoZWlnaHQ9IjEwMCUiIGZpbGw9ImJsYWNrIiAvPjwvc3ZnPg==')] opacity-20 mix-blend-overlay" />

      <When condition={isLink}>
        <ArrowUpRight
          color={textColor}
          className="absolute top-11 right-4 size-7 mix-blend-difference"
        />
      </When>
    </button>
  );
}
