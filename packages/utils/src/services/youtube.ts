import {
  AnalyticsSnapshots,
  ConnectedAccounts,
  db,
  type YouTubeHistoryItem,
  type YouTubeStats,
} from "@repo/db";
import { addSeconds, format, subDays } from "date-fns";
import { and, eq } from "drizzle-orm";
import { google } from "googleapis";
import { z } from "zod";
import { Now } from "../current-date";

const oauth2Client = new google.auth.OAuth2(
  process.env.SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID,
  process.env.SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET
);

const AnalyticsResponseSchema = z.object({
  columnHeaders: z
    .array(
      z.object({
        name: z.string(),
        columnType: z.string().optional(),
        dataType: z.string().optional(),
      })
    )
    .optional()
    .default([]),
  rows: z
    .array(z.array(z.union([z.string(), z.number()])))
    .optional()
    .default([]),
});

const ChannelStatisticsSchema = z.object({
  subscriberCount: z.coerce.number().optional().default(0),
  videoCount: z.coerce.number().optional().default(0),
  viewCount: z.coerce.number().optional().default(0),
});

export const YouTubeService = {
  async fetchAndSaveStats(userId: string, accessToken: string, refreshToken?: string | null) {
    try {
      oauth2Client.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      const youtube = google.youtube({ version: "v3", auth: oauth2Client });
      const analytics = google.youtubeAnalytics({ version: "v2", auth: oauth2Client });

      const channelResponse = await youtube.channels.list({
        part: ["snippet", "statistics"],
        mine: true,
      });

      const channel = channelResponse.data.items?.[0];
      if (!channel) throw new Error("No YouTube channel found.");

      const channelId = channel.id || "";

      const now = Now();
      const thirtyDaysAgo = subDays(now, 30);
      const apiDateFormat = "yyyy-MM-dd";

      const analyticsResponse = await analytics.reports.query({
        ids: "channel==MINE",
        startDate: format(thirtyDaysAgo, apiDateFormat),
        endDate: format(now, apiDateFormat),
        metrics: "views,estimatedMinutesWatched,subscribersGained,likes",
        dimensions: "day",
        sort: "day",
      });

      const existingAccount = await db.query.ConnectedAccounts.findFirst({
        where: and(eq(ConnectedAccounts.userId, userId), eq(ConnectedAccounts.provider, "youtube")),
      });

      const accountData = {
        accessToken,
        ...(refreshToken && { refreshToken }),
        expiresAt: addSeconds(now, 3500),
        updatedAt: now,
        status: "active" as const,
      };

      if (existingAccount) {
        await db
          .update(ConnectedAccounts)
          .set(accountData)
          .where(eq(ConnectedAccounts.id, existingAccount.id));
      } else {
        await db.insert(ConnectedAccounts).values({
          userId,
          provider: "youtube",
          accountId: channelId,
          scope: "read_only",
          ...accountData,
        });
      }

      const data = AnalyticsResponseSchema.parse(analyticsResponse.data);
      const headers = data.columnHeaders;
      const dateIdx = headers.findIndex((h) => h.name === "day");
      const viewsIdx = headers.findIndex((h) => h.name === "views");
      const watchTimeIdx = headers.findIndex((h) => h.name === "estimatedMinutesWatched");
      const subscribersGainedIdx = headers.findIndex((h) => h.name === "subscribersGained");
      const likesIdx = headers.findIndex((h) => h.name === "likes");

      const history: YouTubeHistoryItem[] = data.rows.map((row) => ({
        date: String(row[dateIdx]),
        views: Number(row[viewsIdx]),
        watchTimeMinutes: Number(row[watchTimeIdx]),
        subscribersGained: Number(row[subscribersGainedIdx]),
        likes: Number(row[likesIdx]),
      }));

      const parsedChannelStatistics = ChannelStatisticsSchema.parse(channel.statistics);
      const stats: YouTubeStats = {
        subscribers: parsedChannelStatistics.subscriberCount,
        videos: parsedChannelStatistics.videoCount,
        views: parsedChannelStatistics.viewCount,
      };

      const existingSnapshot = await db.query.AnalyticsSnapshots.findFirst({
        where: and(
          eq(AnalyticsSnapshots.userId, userId),
          eq(AnalyticsSnapshots.provider, "youtube")
        ),
      });

      if (existingSnapshot) {
        await db
          .update(AnalyticsSnapshots)
          .set({
            stats,
            history,
            updatedAt: now,
            platformId: channelId,
          })
          .where(eq(AnalyticsSnapshots.id, existingSnapshot.id));
      } else {
        await db.insert(AnalyticsSnapshots).values({
          userId,
          platformId: channelId,
          provider: "youtube",
          stats,
          history,
        });
      }

      return true;
    } catch (error) {
      const isInvalidGrant = (error as Error).message === "invalid_grant";

      if (isInvalidGrant) {
        console.error(`[YouTube] Refresh token invalid for user ${userId}. Disconnecting account.`);
        await db
          .update(ConnectedAccounts)
          .set({ status: "error" })
          .where(
            and(eq(ConnectedAccounts.userId, userId), eq(ConnectedAccounts.provider, "youtube"))
          );

        return false;
      }

      console.error("[YouTube] Sync failed:", error);
      throw error;
    }
  },
};
