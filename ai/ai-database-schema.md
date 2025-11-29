# Database Schema Documentation

This document outlines the database schema for the Live Media Kit Platform. The project uses **Supabase (PostgreSQL)** and **Drizzle ORM**.

## Overview

The database is designed to support a multi-tenant architecture where creators (Users) can manage multiple Media Kits.

- **Authentication**: Handled by Supabase Auth (`auth.users`).
- **User Data**: Stored in `public.profiles`, linked 1:1 with `auth.users`.
- **Content**: Stored in `public.media_kits`.

---

## Tables

### 1. Profiles (`public.profiles`)

Stores application-specific user data. This table extends Supabase's `auth.users` table.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `PK`, `FK -> auth.users.id` | Primary Key, matches Supabase Auth User ID. |
| `email` | `text` | `NOT NULL` | User's email address. |
| `username` | `text` | `UNIQUE` | Unique handle for the creator (e.g., "josh"). |
| `tier` | `subscription_tier` | `DEFAULT 'free'`, `NOT NULL` | Subscription tier (`free` or `pro`). |
| `onboarding_steps` | `onboarding_steps[]` | `DEFAULT []`, `NOT NULL` | Array of completed onboarding steps (e.g., `['username', 'stats']`). |
| `created_at` | `timestamp` | `DEFAULT now()` | Creation timestamp. |
| `updated_at` | `timestamp` | `DEFAULT now()` | Last update timestamp. |

**Row Level Security (RLS):**
- **Select**: Users can view their own profile.
- **Update**: Users can update their own profile.
- **Insert**: Users can insert their own profile (on signup).

### 2. Subscriptions (`public.subscriptions`)

Stores subscription details, allowing for multiple providers (Stripe, Lemon Squeezy, etc.).

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `PK`, `DEFAULT gen_random_uuid()` | Unique ID. |
| `user_id` | `uuid` | `FK -> profiles.id`, `UNIQUE` | Link to the user. |
| `provider` | `text` | `NOT NULL` | Payment provider (e.g., 'stripe'). |
| `customer_id` | `text` | `UNIQUE` | Provider's Customer ID. |
| `subscription_id` | `text` | `UNIQUE` | Provider's Subscription ID. |
| `price_id` | `text` | | Provider's Price/Plan ID. |
| `current_period_end` | `timestamp` | | Subscription expiration date. |
| `created_at` | `timestamp` | `DEFAULT now()` | Creation timestamp. |
| `updated_at` | `timestamp` | `DEFAULT now()` | Last update timestamp. |

**Row Level Security (RLS):**
- **Select**: Users can view their own subscription.

### 3. Media Kits (`public.media_kits`)

Stores the media kits created by users.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `PK`, `DEFAULT gen_random_uuid()` | Unique ID for the kit. |
| `user_id` | `uuid` | `FK -> profiles.id` | Owner of the kit. |
| `slug` | `text` | `UNIQUE`, `NOT NULL` | URL slug for the kit (e.g., "gaming"). |
| `published` | `boolean` | `DEFAULT false`, `NOT NULL` | Whether the kit is publicly visible. |
| `theme` | `jsonb` | | Visual theme settings (primary color, radius). |
| `created_at` | `timestamp` | `DEFAULT now()` | Creation timestamp. |
| `updated_at` | `timestamp` | `DEFAULT now()` | Last update timestamp. |

**Row Level Security (RLS):**
- **Select**: Public access (Only if `published = true`). Users can always view their own.
- **Insert**: Users can create kits for themselves.
- **Update**: Users can update their own kits.
- **Delete**: Users can delete their own kits.

---

### 4. Connected Accounts (`public.connected_accounts`)

Stores OAuth credentials for external platforms (YouTube, Instagram, etc.).

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `PK`, `DEFAULT gen_random_uuid()` | Unique ID. |
| `user_id` | `uuid` | `FK -> profiles.id`, `NOT NULL` | Link to the user. |
| `provider` | `connected_account_provider` | `NOT NULL` | Platform name (e.g., 'youtube'). |
| `account_id` | `text` | `NOT NULL` | External Platform ID (e.g., YT Channel ID). |
| `access_token` | `text` | `NOT NULL` | Token for immediate API requests. |
| `refresh_token` | `text` | | Token for background updates (Offline Access). Critical for keeping data fresh. |
| `expires_at` | `timestamp` | | Expiration time for the access token. Used to determine when to refresh. |
| `scope` | `text` | | Scopes granted by the user (e.g., to verify 'analytics.readonly'). |
| `created_at` | `timestamp` | `DEFAULT now()` | Creation timestamp. |
| `updated_at` | `timestamp` | `DEFAULT now()` | Last update timestamp. |

**Row Level Security (RLS):**
- **Select**: Users can view their own connected accounts.
- **Insert**: Users can connect new accounts.
- **Update**: Users can update their own connected accounts (e.g., refreshing tokens).
- **Delete**: Users can disconnect accounts.

### 5. Analytics Snapshots (`public.analytics_snapshots`)

Stores historical and current analytics data for connected platforms.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `PK`, `DEFAULT gen_random_uuid()` | Unique ID. |
| `user_id` | `uuid` | `FK -> profiles.id`, `NOT NULL` | Link to the user. |
| `platform_id` | `text` | `NOT NULL` | Links snapshot to specific channel/account. |
| `stats` | `jsonb` | | The "Header" Data (Fast, cheap to read). Typed as `AnalyticsStats`. |
| `history` | `jsonb` | | The "Growth Graph" Data (The "Verified" Proof). Typed as `AnalyticsHistoryItem[]`. |
| `created_at` | `timestamp` | `DEFAULT now()` | Creation timestamp. |

**Row Level Security (RLS):**
- **Select**: Users can view their own snapshots.
- **Insert**: System or User can create snapshots.

---

## Relationships

- **One-to-One**: `auth.users` ↔ `public.profiles`
- **One-to-Many**: `public.profiles` ↔ `public.media_kits` (One creator can have multiple kits).

## Enums

- **subscription_tier**: `['free', 'pro']`
- **onboarding_steps**: `['username', 'stats']`
- **connected_account_provider**: `['youtube']`

## JSON Types

### MediaKitTheme
```typescript
interface MediaKitTheme {
  primary: string;
  radius: number;
}
```

### AnalyticsStats
```typescript
interface AnalyticsStats {
  subscriberCount: number;
  videoCount: number;
  viewCount: number;
}
```

### AnalyticsHistoryItem
```typescript
interface AnalyticsHistoryItem {
  date: string;
  views: number;
  watchTimeMinutes: number;
}
```
