# Project Structure & Tech Stack

## 1. The Stack (Bleeding Edge)

| Component | Technology |
|-----------|-----------|
| **Monorepo** | Turborepo |
| **Package Manager** | Bun (Fast, all-in-one toolkit) |
| **Runtime** | Bun (Replaces Node.js) |
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript (Strict Mode) |
| **Styling** | Tailwind CSS v4 (CSS-first configuration, NO tailwind.config.js) |
| **Components** | shadcn/ui (Radix UI primitives) |
| **Animation** | Motion + tailwindcss-animate |
| **Database** | Supabase (PostgreSQL) |
| **ORM** | Drizzle ORM (preferred) or Prisma |
| **Linting/Formatting** | Biome (Replaces ESLint + Prettier) |

---

## 2. Monorepo Architecture

The project uses a standard Turborepo layout with Bun workspaces:

```
.
├── package.json             # Root workspace configuration
├── bun.lockb               # Bun lockfile (binary)
├── biome.json              # Biome configuration
├── turbo.json
├── apps/
│   ├── dashboard/           # Next.js 15 (Creator Admin Portal)
│   │   ├── Features: Supabase Auth (SSR), OAuth Connect, Lemon Squeezy Billing, Theme Editor
│   │   └── Uses "use client" heavily for the editor interface
│   └── template/           # Next.js App Template - copy to create new apps
└── packages/
    ├── ui/                  # Shared Design System
    │   ├── src/components/      (Shadcn components)
    │   ├── src/lib/utils.ts     (cn utility)
    │   └── src/base.css          (Base theme - imported by apps)
    ├── db/                  # Database Schema & Client
    │   ├── src/schema/          # Drizzle schema definitions
    │   │   ├── index.ts         # Exports all schema
    │   │   ├── account.sql.ts
    │   │   ├── analytics.sql.ts
    │   │   ├── enums.sql.ts
    │   │   ├── media-kits.sql.ts
    │   │   ├── relations.sql.ts
    │   │   ├── schema.constants.ts
    │   │   ├── schema.helpers.ts
    │   │   ├── subscriptions.sql.ts
    │   │   └── views.sql.ts
    │   ├── src/client.ts         (Supabase connection)
    │   └── src/index.ts          (Entry point)
    ├── utils/               # Shared Helpers
    │   └── Currency formatting, Number compaction, etc.
    └── config/              # Shared TSConfig, Biome config
```

---

## 3. Domain & Routing Strategy

We use a **Multi-Zone** architecture to serve multiple apps under the `kyt.one` domain.

### Architecture
- **`app.kyt.one`** -> `apps/dashboard`
    - Standalone Next.js app for the Creator Admin Dashboard.
- **`kyt.one`** -> `apps/landing`
    - The "Main Router" app.
    - Serves Landing Page, Pricing, About, etc.
- **`kyt.one/[username]`** -> `apps/profile`
    - Served via **Rewrite** from `apps/landing`.
    - If a route is NOT found in `apps/landing`, it rewrites to `apps/profile` (hosted at `profiles.kyt.one`).

### Routing Logic (apps/landing/next.config.js)
1.  **Filesystem Priority**: Checks if page exists in `apps/landing` (e.g., `/pricing`). If yes, serve it.
2.  **Rewrite Fallback**: If not found, rewrite to `profiles.kyt.one/:path*`.

This allows us to have a unified domain experience while keeping the Marketing and Profile apps separate.

---

## 4. Dependency Management

Uses Bun workspaces and **Bun Catalogs** for version consistency.

### Bun Catalogs
Shared dependencies are defined in the root `package.json` under `catalogs`:
- **default**: Core deps (React, Next.js, TypeScript)
- **ui**: UI deps (Tailwind, Radix, Lucide)
- **db**: Database deps (Supabase, Drizzle)

Usage in `package.json`:
```json
"dependencies": {
  "react": "catalog:default",
  "tailwindcss": "catalog:ui"
}
```

### Commands
```bash
bun install                    # Install all dependencies
bun add react --cwd apps/dashboard  # Add to specific workspace
bun run dev                    # Run all apps
```

---

## 5. Biome Configuration

Single tool for linting and formatting. Commands:
```bash
bun run lint      # Check for issues
bun run format    # Format code
```

---

## 6. Database Management

The project uses Drizzle ORM for database management. Commands (run in `packages/db`):
```bash
bun run db:push       # Push schema changes directly to the database (prototyping)
bun run db:generate   # Generate SQL migrations (production)
bun run db:studio     # Open Drizzle Studio to view/edit data
```

---

## 7. Theming Strategy

- **Base Theme**: `packages/ui/src/base.css` - shared CSS variables and design tokens
- **App Themes**: Each app's `app/tailwind.css` imports base and can override variables
- **Runtime**: `ThemeProvider` supports user-customizable themes (light theme only for now)

---

## 8. Code Style Guidelines

**General**: Concise, functional, predictable. Server-first (RSC by default, `"use client"` only at leaves).

**TypeScript**: No `any`. Use Zod for boundaries. Rely on type inference.

**Next.js 15**: Server Actions for mutations. Fetch in Server Components. Use Suspense for loading.

**Tailwind**: CSS variables for design tokens. Use `cn()` for className merging.

**Biome**: Auto-format before commit. No unused imports.

**Components**: Check `packages/ui/src/components` first. Use `@repo/ui` imports.

**AI Interaction Rules**:
- **No Comments**: Do not add comments explaining *what* the code does. Only explain *why* a complex decision was made.
- **Scaffolding**: When asked to create a component, check `packages/ui/src/components` first. Do not duplicate primitives.
- **Imports**: Use workspace imports `@repo/ui` for shared components, or relative imports within packages.

---

## 9. Creating New Apps

```bash
cp -r apps/template apps/[your-app-name]
```

Update `package.json` name and `app/layout.tsx` metadata.