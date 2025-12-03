import { timestamp } from "drizzle-orm/pg-core";
import type { KitBlock, MediaKitTheme } from "./schema/media-kits.sql";

// -- Common Columns --
export const timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
};

// -- Default Values --
export const GetDefaultKitBlocks = (username: string): KitBlock[] => {
  return [
    { id: "1", type: "profile", data: { displayName: username } },
    {
      id: "2",
      type: "separator",
      data: { title: "Stats" },
    },
    {
      id: "3",
      type: "stats",
      data: {
        provider: "youtube",
        metric: "all",
      },
    },
    {
      id: "4",
      type: "separator",
      data: { title: "Contact" },
    },
    { id: "5", type: "contact", data: { buttonText: "Get in touch" } },
  ];
};

export const DefaultKitTheme: MediaKitTheme = {
  primary: "#171717",
  radius: 0.5,
};
