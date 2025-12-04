import {
  type InstagramChartMetric,
  InstagramChartMetrics,
  type InstagramStatMetric,
  InstagramStatMetrics,
  ProviderList,
  type StatsOrChartBlockType,
  type YouTubeChartMetric,
  YouTubeChartMetrics,
  type YouTubeStatMetric,
  YouTubeStatMetrics,
} from "@repo/db";

type AllMetrics =
  | YouTubeStatMetric
  | InstagramStatMetric
  | YouTubeChartMetric
  | InstagramChartMetric;

const MetricLabels: Record<AllMetrics, string> = {
  all: "All Stats (Grid)",
  subscribers: "Subscribers",
  views: "Views",
  videos: "Videos",
  watchTimeMinutes: "Watch Time",
  subscribersGained: "Subscribers Gained",
  likes: "Likes",
  followers: "Followers",
};

const ProviderLabels: Record<(typeof ProviderList)[number], string> = {
  youtube: "YouTube",
  instagram: "Instagram (Coming Soon)",
};

export const ProviderOptions = ProviderList.map((p) => ({
  label: ProviderLabels[p],
  value: p,
  disabled: p === "instagram",
}));

function getOptions(metrics: readonly AllMetrics[]) {
  return metrics.map((m) => ({
    label: MetricLabels[m],
    value: m,
  }));
}

export function getProviderMetricOptions(provider: string, blockType: StatsOrChartBlockType) {
  switch (provider) {
    case "youtube":
      if (blockType === "stats") return getOptions(YouTubeStatMetrics);
      if (blockType === "chart") return getOptions(YouTubeChartMetrics);
      break;
    case "instagram":
      if (blockType === "stats") return getOptions(InstagramStatMetrics);
      if (blockType === "chart") return getOptions(InstagramChartMetrics);
      break;
  }
  return [];
}
