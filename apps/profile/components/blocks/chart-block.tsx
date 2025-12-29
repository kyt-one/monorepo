"use client";

import type { AnalyticsProvider, ChartBlockData } from "@repo/db";
import { MetricLabels, ProviderLabels } from "@repo/utils";
import { format } from "date-fns";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

interface Props {
  data: ChartBlockData;
  analyticsProvider: AnalyticsProvider;
}

export function ChartBlock({ data, analyticsProvider }: Props) {
  const history = analyticsProvider[data.provider].history;
  const days = data.days;
  const chartData = history.slice(-days).reverse();

  return (
    <div className="h-full cursor-pointer overflow-hidden relative rounded-4xl bg-stone-900 border border-stone-800 p-8 transition-all duration-500 hover:-translate-y-1">
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(20,184,166,0.15)_0%,transparent_70%)] blur-3xl transition-all duration-700 group-hover:scale-125" />

      <div
        className="absolute inset-0 opacity-15 z-0 pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("/images/patterns/pattern-2.svg")`,
          backgroundSize: "30px",
          backgroundRepeat: "repeat",
        }}
      />

      <div className="absolute top-6 left-6 flex items-center justify-center">
        <div className="flex size-3 items-center justify-center rounded-full bg-stone-950 shadow-[inset_0_1px_3px_rgba(0,0,0,0.8),0_1px_0_rgba(255,255,255,0.1)]">
          <div className="size-1.5 rounded-full bg-[#17B26A] shadow-[0_0_8px_1.5px_rgba(23,178,106,0.6)] animate-pulse"></div>
        </div>
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-between">
        <div className="space-y-1 text-center">
          <h3 className="font-serif text-3xl font-bold tracking-tight text-white">
            {MetricLabels[data.metric]}
          </h3>
          <div className="flex-row-center gap-2 text-stone-400">
            <span className="text-[10px] font-bold uppercase tracking-widest">
              {ProviderLabels[data.provider]}
            </span>
            <span className="size-0.5 rounded-full bg-stone-400" />
            <p className="text-[10px] font-bold uppercase tracking-widest">Last {days} days</p>
          </div>
        </div>

        <div className="h-[120px] w-full mt-2 animate-in fade-in duration-1200">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="chartGradientDark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff3f3f" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#ff3f3f" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" hide />
              <Tooltip
                cursor={{ stroke: "#ff3f3f", strokeWidth: 1, strokeDasharray: "4 4", opacity: 0.5 }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-2xl border border-stone-800 bg-stone-950/40 p-3 shadow-2xl backdrop-blur-md">
                        <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-stone-400">
                          {format(new Date(label), "PPP")}
                        </p>
                        <p className="font-serif text-lg font-bold text-[#ff3f3f]">
                          {payload[0].value}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey={data.metric}
                stroke="#ff3f3f"
                strokeWidth={4}
                strokeLinecap="round"
                isAnimationActive={false}
                fill="url(#chartGradientDark)"
                dot={false}
                activeDot={{
                  r: 4,
                  fill: "#1c1917",
                  stroke: "#ff3f3f",
                  strokeWidth: 3,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
