# Project Summary: Kyt (MVP Strategy)

## 1. Product Vision

We are building a **"Live Media Kit Platform"**—a specialized portfolio tool for content creators.

- **Problem**: Creators use static PDFs that are untrustworthy and hard to customize for specific brands.
- **Solution**: A **Multi-Kit Platform** where creators build "Verified One-Pagers." They can create a general kit for everyone, or tailored kits for specific sponsors (e.g., "Gaming Stats" vs. "Tech Stats").
- **Core Value**: **Verified Trust** (API Data) + **Tailored Relevance** (Custom Kits).

---

## 2. Core User Flows

### A. The Creator (Authenticated User)

1. **Onboarding**: Sign up via Google (Supabase Auth) -> **Username** -> **Avatar Upload** -> **One-Click YouTube Sync**.
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
    - *Result*: A Pro user can have 10 different kits displaying the same YouTube stats, but we only burn **1 API call** to update them all.

### URL Routing Strategy
- **Primary Kit**: `kyt.one/[username]` (Default)
- **Secondary Kits (Pro)**: `kyt.one/[username]/[slug]` (e.g., `/josh/q4-rates`)

### Monetization (Micro-SaaS)

**Model**: Freemium. "Speed" (Data Freshness) is the primary upgrade hook for the Annual Plan.

| Feature | Free Tier | Pro Monthly ($7/mo) | Pro Annual ($70/yr) |
| :--- | :--- | :--- | :--- |
| **Kits Allowed** | **1 (Primary)** | **Unlimited** | **Unlimited** |
| **Sync Frequency** | Daily (24h) | Hourly (1h) | **Live (15m)** |
| **Data Depth** | Current Stats | 30-Day Growth | 30-Day Growth |
| **Branding** | "Powered by Kyt" | **White Label** | **White Label** |
| **Verification** | Standard | Standard | **Priority / Pulsing Badge** |

### Infrastructure & Operations
- **Domain**: `kyt.one`
- **Payments**: Lemon Squeezy (Merchant of Record).
- **Email**: Forwarding configured to personal email (Cost saving).
    - `admin@kyt.one`
    - `contact@kyt.one`
    - `hello@kyt.one`

---

## 4. Key Technical Decisions

| Aspect | Implementation |
|--------|----------------|
| **Frontend Layout** | Vertical Stack of Shadcn/UI Cards (Mobile First) |
| **Data Strategy** | **Snapshot Pattern** (Cron + Lazy Updates) |
| **Data Schema** | `users` -> `kits` (JSONB Blocks) -> `snapshots` (API Data) |
| **Theming** | Runtime CSS Variables (`--primary`) injected via Style tag |
| **Performance** | Next.js 15 ISR or Aggressive Caching (Lighthouse 100) |

---

## 5. Data Refresh Architecture (Hybrid Model)

We use a hybrid system designed to balance **Performance (Speed)**, **Cost (API Quota)**, and **Data Integrity (History)**.

### 1. The "Lazy Update" Flow (Stale-While-Revalidate)
*Handles the "Live Data" promise for active users.*

**The Scenario**:
- **User**: Josh (Annual Pro)
- **Rule**: Updates every **15 minutes**.
- **State**: Last update was 20 minutes ago (Data is "Stale").

**The Flow (when a Brand visits `kyt.one/josh`)**:
1.  **Instant Read**: The server fetches Josh's data from the database.
2.  **The Check**: It sees the data is 20 minutes old (Stale).
3.  **The Response**: It **immediately** sends the "old" (20 min) data to the browser.
    - *Result*: The page loads in <100ms. No loading spinners.
4.  **The Background Task**: After the response is sent, the server stays alive (using `after()`) and calls the YouTube API.
5.  **The Update**: The new stats are saved to the database.
6.  **The Next Visitor**: Anyone who visits 1 second later gets the **Fresh Data**.

### 2. The Cron Job (Data Continuity)
*Handles "History Gaps" for inactive users.*

**The Problem**:
If we *only* used Lazy Updates, we would have "History Gaps."
- **Scenario**: Josh goes on vacation for 3 weeks. No one visits his link.
- **Result**: No API calls are made for 21 days.
- **The Chart**: When he returns, his "30-Day Growth" graph has a flat line or gap.

**The Solution**:
- **Schedule**: Runs once every **24 hours** (Midnight).
- **Action**: Forces an update for everyone, regardless of traffic.
- **Cost**: 1 API Unit per user/day.
- **Result**: Even if Josh is inactive, we capture his daily stats. His history graph remains continuous.

### Summary of Costs

| Mechanism | Purpose | Frequency | Cost (Quota) |
| :--- | :--- | :--- | :--- |
| **Lazy Update** | "Live" numbers for active deals. | High (On Visit) | Varies (High efficiency) |
| **Cron Job** | Continuous history graphs. | Low (Daily) | Fixed (1 unit/user) |