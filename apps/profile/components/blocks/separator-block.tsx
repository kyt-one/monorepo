"use client";

import type { SeparatorBlockData } from "@repo/db";
import { AutoTextSize } from "auto-text-size";
import { When } from "react-if";

interface Props {
  data: SeparatorBlockData;
}

export function SeparatorBlock({ data }: Props) {
  const hasContent = !!data.content;

  return (
    <div className="relative size-full bg-[#FAFAF8] cursor-pointer rounded-4xl transition-all duration-500 hover:-translate-y-1 overflow-hidden group flex items-center justify-center p-8 border border-stone-200">
      <div className="flex-col-center justify-between w-full h-full">
        <div className="w-full h-px bg-stone-200" />

        <div className="flex-col-center w-full text-center">
          <div className="flex-row-center w-full">
            <AutoTextSize
              className="text-stone-800 font-serif leading-tight tracking-tighter"
              mode="multiline"
              maxFontSizePx={60}
              minFontSizePx={25}
            >
              {data.title}
            </AutoTextSize>
          </div>

          <When condition={hasContent}>
            <div className="flex-row-center w-full">
              <AutoTextSize
                className="text-stone-800 font-serif leading-tight tracking-tighter"
                mode="multiline"
                maxFontSizePx={22}
                minFontSizePx={16}
              >
                {data.content}
              </AutoTextSize>
            </div>
          </When>
        </div>

        <div className="w-full h-px bg-stone-200" />
      </div>
    </div>
  );
}
