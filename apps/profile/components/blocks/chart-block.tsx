"use client";

import type { AnalyticsProvider, ChartBlockData } from "@repo/db";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

interface Props {
  data: ChartBlockData;
  analyticsProvider: AnalyticsProvider;
}

export function ChartBlock({ data, analyticsProvider }: Props) {
  const history = analyticsProvider[data.provider]?.history || [];
  const days = data.days;

  if (history.length === 0) return null;

  const chartData = history.slice(-days).reverse();

  return (
    <div
      className="relative overflow-hidden rounded-2xl bg-linear-to-br from-slate-800 to-slate-900 text-white border-2 border-slate-700/50 transition-all duration-300 hover:scale-[1.01] hover:-translate-y-0.5"
      style={{ boxShadow: "var(--shadow-brutal-lg)" }}
    >
      <div className="p-6 pb-2">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              {data.metric} Growth
            </span>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-black tracking-tight">{days} Days</span>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                <TrendingUp className="size-3" />
                <span>Live</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-[160px] w-full px-2 pb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#14b8a6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" hide />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.1)",
                backgroundColor: "rgba(15, 23, 42, 0.95)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                color: "#fff",
              }}
              labelStyle={{ color: "#94a3b8" }}
              itemStyle={{ color: "#14b8a6" }}
            />
            <Area
              type="monotone"
              dataKey={data.metric}
              stroke="#14b8a6"
              strokeWidth={3}
              fill="url(#chartGradient)"
              dot={false}
              activeDot={{ r: 6, fill: "#14b8a6", stroke: "#fff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-teal-500 via-emerald-500 to-teal-500" />
    </div>
  );
}
