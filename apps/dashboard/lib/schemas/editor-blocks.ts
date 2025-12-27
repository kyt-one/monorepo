import {
  InstagramChartMetricsList,
  InstagramStatMetricsList,
  ProviderList,
  YouTubeChartMetricsList,
  YouTubeStatMetricsList,
} from "@repo/db/schema/schema.constants";
import { z } from "zod";

export const SeparatorSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().default(""),
});

export const StatsSchema = z.object({
  provider: z.enum(ProviderList),
  metric: z.enum([...YouTubeStatMetricsList, ...InstagramStatMetricsList]),
});

export const ChartSchema = z.object({
  provider: z.enum(ProviderList),
  metric: z.enum([...YouTubeChartMetricsList, ...InstagramChartMetricsList]),
  days: z.coerce.number().min(7).max(365).default(30),
});

export const CustomSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  textColor: z.string().optional(),
  link: z.string().url().optional().or(z.literal("")),
  backgroundColor: z.string().optional(),
  backgroundImage: z.string().optional(),
});

export const ContactSchema = z.object({
  buttonText: z.string().min(1, "Button text is required"),
});

export const ProfileSchema = z.object({
  displayName: z.string().optional(),
  tagline: z.string().optional(),
  customAvatarUrl: z.string().optional(),
});

export const BlockSchema = z.discriminatedUnion("type", [
  z.object({
    id: z.string(),
    type: z.literal("separator"),
    data: SeparatorSchema,
  }),
  z.object({
    id: z.string(),
    type: z.literal("stats"),
    data: StatsSchema,
  }),
  z.object({
    id: z.string(),
    type: z.literal("chart"),
    data: ChartSchema,
  }),
  z.object({
    id: z.string(),
    type: z.literal("custom"),
    data: CustomSchema,
  }),
  z.object({
    id: z.string(),
    type: z.literal("contact"),
    data: ContactSchema,
  }),
]);

export const BlockDataSchema = z.union([
  SeparatorSchema,
  StatsSchema,
  ChartSchema,
  CustomSchema,
  ContactSchema,
]);
