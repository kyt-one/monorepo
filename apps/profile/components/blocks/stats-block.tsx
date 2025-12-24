import type { AnalyticsProvider, StatsBlockData, YouTubeStats } from "@repo/db";
import { MetricLabels, ProviderLabels, shortNumber } from "@repo/utils";
import { Check } from "lucide-react";
import Image from "next/image";

interface Props {
  data: StatsBlockData;
  analyticsProvider: AnalyticsProvider;
}

export function StatsBlock({ data, analyticsProvider }: Props) {
  const snapshot = analyticsProvider[data.provider];
  if (!snapshot) return null;

  const stats = snapshot.stats;
  if (data.provider !== "youtube") return null;

  const youtubeStats = stats as YouTubeStats;

  return (
    <div className="cursor-pointer group relative overflow-hidden rounded-4xl bg-stone-50 border border-stone-100 p-8 transition-all duration-500 hover:-translate-y-1">
      <div className="absolute -right-10 -top-12 h-64 w-72 rounded-full bg-[radial-gradient(circle,rgba(255,0,0,0.14)_0%,transparent_70%)] blur-xl transition-all duration-500 group-hover:right-0" />

      <div className="absolute -left-10 -bottom-10 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(255,50,50,0.1)_0%,transparent_70%)] blur-xl transition-all duration-500 group-hover:left-0" />

      <div className="absolute top-6 right-6 flex items-center justify-center">
        <div className="flex size-3 items-center justify-center rounded-full bg-[#EAECF0] shadow-[inset_0_1px_3px_rgba(0,0,0,0.2),0_1px_0_rgba(255,255,255,0.8)]">
          <div className="size-1.5 rounded-full bg-green-600 shadow-[0_0_8px_1.5px_rgba(0,206,110,0.4)] animate-pulse"></div>
        </div>
      </div>

      <div className="relative z-10 flex h-full flex-col justify-between gap-5">
        <div className="flex items-center gap-2">
          <div className="relative size-8 transition-transform duration-500 group-hover:-rotate-12">
            <Image src="/images/youtube/logo.webp" alt="YouTube" fill className="object-contain" />
          </div>

          <div className="flex-row-center gap-1.5">
            <span className="font-serif text-2xl font-bold tracking-tight">
              {ProviderLabels[data.provider]}
            </span>

            <div className="flex mt-0.5 p-1 items-center justify-center rounded-full bg-[#ff3f3f] text-white">
              <Check size={10} strokeWidth={4} />
            </div>
          </div>
        </div>

        <div className="flex flex-col py-2">
          <span className="font-serif text-5xl font-black tracking-tighter md:text-7xl leading-[0.85]">
            {shortNumber(youtubeStats.subscribers)}
          </span>
          <span className="mt-3 text-sm font-bold uppercase tracking-widest text-stone-400">
            {MetricLabels.subscribers}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-8 border-t border-stone-300/50 pt-5">
          <div className="flex flex-col gap-1">
            <span className="font-serif text-4xl font-bold">{shortNumber(youtubeStats.views)}</span>

            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
              {MetricLabels.views}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="font-serif text-4xl font-bold">
              {shortNumber(youtubeStats.videos)}
            </span>

            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
              {MetricLabels.videos}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
