import { timestamp } from "drizzle-orm/pg-core";
import type { KitBlock, MediaKitTheme } from "./media-kits.sql";

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

export const CheckoutTiersConfig = {
  pro: {
    month: { productId: "144a3a5c-8f37-41cd-9738-ee63d568f3bb", variantId: "1130040", price: 6.99 },
    year: { productId: "39a9bc8d-460d-48ad-bfe4-8a52d09c5d6e", variantId: "1130402", price: 69.99 },
  },
} as const;

// -- Common Columns --
export const timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
};

// Types
export type CheckoutTierConfig = typeof CheckoutTiersConfig;
