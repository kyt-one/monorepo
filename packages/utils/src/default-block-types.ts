import type {
  ChartBlockData,
  ContactBlockData,
  CustomBlockData,
  KitBlock,
  ProfileBlockData,
  SeparatorBlockData,
  StatsBlockData,
} from "@repo/db";
import { randomId } from "./random-id";

export const createDefaultBlock = (
  type: KitBlock["type"],
  overrides: Partial<KitBlock["data"]> = {}
): KitBlock => {
  const id = randomId();

  switch (type) {
    case "profile":
      return {
        id,
        type,
        data: { displayName: "", ...(overrides as Partial<ProfileBlockData>) },
      };
    case "separator":
      return {
        id,
        type,
        data: {
          title: "New Section",
          content: "Some content",
          ...(overrides as Partial<SeparatorBlockData>),
        },
      };
    case "stats":
      return {
        id,
        type,
        data: {
          provider: "youtube",
          metric: "all",
          ...(overrides as Partial<StatsBlockData>),
        },
      };
    case "chart":
      return {
        id,
        type,
        data: {
          provider: "youtube",
          metric: "views",
          days: 30,
          ...(overrides as Partial<ChartBlockData>),
        },
      };
    case "custom":
      return {
        id,
        type,
        data: {
          title: "New Card",
          description: "Edit me...",
          backgroundColor: "#d04343",
          textColor: "#ffffff",
          ...(overrides as Partial<CustomBlockData>),
        },
      };
    case "contact":
      return {
        id,
        type,
        data: {
          buttonText: "Work With Me",
          ...(overrides as Partial<ContactBlockData>),
        },
      };
    default:
      return {
        id,
        type: "custom",
        data: { title: "New Block", description: "Unknown Type" },
      };
  }
};
