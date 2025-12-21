export const ProviderList = ["youtube", "instagram"] as const;

export const YouTubeStatMetricsList = ["subscribers", "views", "videos", "all"] as const;
export const YouTubeChartMetricsList = [
  "views",
  "watchTimeMinutes",
  "subscribersGained",
  "likes",
] as const;

export const InstagramStatMetricsList = ["followers", "likes", "all"] as const;
export const InstagramChartMetricsList = ["followers", "likes"] as const;

export const SubscriptionProviderList = ["lemon-squeezy"] as const;
export const SubscriptionTierList = ["free", "pro"] as const;
export const SubscriptionIntervalList = ["month", "year"] as const;

export const OnboardingStepList = ["username", "avatar", "stats", "welcome"] as const;

export const MediaKitEventTypeList = ["view", "share", "contact_click", "link_click"] as const;

export const ConnectedAccountStatusList = ["active", "error", "expired"] as const;
