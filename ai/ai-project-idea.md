# Project Summary: Kyt (MVP Strategy)

## 1. Product Vision

We are building a **"Live Media Kit Platform"**—a specialized portfolio tool for content creators.

- **Problem**: Creators use static PDFs that are untrustworthy and hard to customize for specific brands.
- **Solution**: A **Multi-Kit Platform** where creators build "Verified One-Pagers." They can create a general kit for everyone, or tailored kits for specific sponsors (e.g., "Gaming Stats" vs. "Tech Stats").
- **Core Value**: **Verified Trust** (API Data) + **Tailored Relevance** (Custom Kits).

---

## 2. Core User Flows

### A. The Creator (Authenticated User)

1. **Onboarding**: Sign up via Google (Supabase Auth) -> **One-Click YouTube Sync**.
    - *System automatically generates a "Primary Kit" at `kit.bio/username`.*
2. **Kit Management (The Dashboard)**:
    - **Single View**: Free users manage their one Primary Kit.
    - **Multi-View (Pro)**: Users can **Create New** or **Duplicate** existing kits to create specific campaign pages (e.g., `kit.bio/username/gaming`).
3. **The "Stack" Editor**:
    - **Layout**: Vertical stack of "Smart Blocks" (Mobile-first).
    - **Block Types**:
        - *Static*: Bio, Link Group, Text Area, Past Sponsors.
        - *Dynamic*: YouTube Growth Graph, Avg Views Card, Rate Card Calculator.
4. **Theming**: "TweakCDN" style. User picks **Primary Color** and **Corner Radius**. Changes apply instantly via CSS variables.

### B. The Brand (Public Visitor)

1. **Experience**: Instant load, mobile-optimized "App-like" feel.
2. **Trust Signals**:
    - **"Verified" Badge**: Confirms data comes directly from YouTube API.
    - **Engagement Sparkline**: Shows view velocity (e.g., "Gained 5k views this week").
3. **Action (Conversion)**:
    - User clicks **"Work With Me"**.
    - System performs a server-side check (Server Action) to reveal the email or open a form, protecting the creator from scrapers.

---

## 3. Key Business Logic & Architecture

### The "Campaign" Logic (One User -> Many Kits)

To allow tailored pitching without duplicating API costs:
- **Relationship**: `User` (1) ↔ `Kits` (Many).
- **Quota Protection**: The **Snapshot Engine** (YouTube API fetcher) is linked to the `User`, not the `Kit`.
    - *Result*: A Pro user can have 10 different kits displaying the same YouTube stats, but we only burn **1 API call** per day to update them all.

### URL Routing Strategy

- **Primary Kit**: `kyt.one/[username]` (Default)
- **Secondary Kits (Pro)**: `kyt.one/[username]/[slug]` (e.g., `/josh/q4-rates`)

### Infrastructure & Operations

- **Domain**: `kyt.one`
- **Email**: Forwarding configured to personal email (Cost saving).
    - `admin@kyt.one`
    - `contact@kyt.one`
    - `hello@kyt.one`

### Monetization (Micro-SaaS)

**Model**: Freemium. The "Tailored Experience" is the upgrade hook.

| Feature | Free Tier | Pro Tier ($7/mo) |
| :--- | :--- | :--- |
| **Kits Allowed** | **1 (Primary Only)** | **Unlimited** (Tailored Links) |
| **Sync Frequency** | Weekly | Daily/Hourly |
| **Data Depth** | Current Stats Only | **Historical Growth Graphs** |
| **Branding** | "Powered by [App]" | **White Label** |
| **Domain** | `kyt.one/user` | **Custom Domain** (`kit.user.com`) |

---

## 4. Key Technical Decisions

| Aspect | Implementation |
|--------|----------------|
| **Frontend Layout** | Vertical Stack of Shadcn/UI Cards (Mobile First) |
| **Data Strategy** | **Snapshot Pattern** (Cron -> DB -> Client) |
| **Data Schema** | `users` -> `kits` (JSONB Blocks) -> `snapshots` (API Data) |
| **Theming** | Runtime CSS Variables (`--primary`) injected via Style tag |
| **Performance** | Next.js 15 ISR or Aggressive Caching (Lighthouse 100) |