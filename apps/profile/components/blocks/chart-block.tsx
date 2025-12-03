"use client";

import type { AnalyticsProvider, ChartBlockData } from "@repo/db";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

interface Props {
  data: ChartBlockData;
  analyticsProvider: AnalyticsProvider;
}

export function ChartBlock({ data, analyticsProvider }: Props) {
  const history = analyticsProvider[data.provider]?.history || [];
  const days = data.days;

  if (history.length === 0) return null;

  return (
    <Card className="rounded-(--radius) shadow-sm border-slate-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground capitalize">
          {data.metric} Growth ({days} Days)
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[150px] w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history.slice(-days).reverse()}>
            <defs>
              <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" hide />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              labelStyle={{ color: "#666" }}
            />
            <Area
              type="monotone"
              dataKey={data.metric}
              stroke="var(--primary)"
              fillOpacity={1}
              fill="url(#colorMetric)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
