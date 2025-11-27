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
│   │   ├── Features: Auth, OAuth Connect, Stripe Billing, Theme Editor
│   │   └── Uses "use client" heavily for the editor interface
│   └── template/           # Next.js App Template - copy to create new apps
└── packages/
    ├── ui/                  # Shared Design System
    │   ├── src/components/      (Shadcn components)
    │   ├── src/lib/utils.ts     (cn utility)
    │   └── src/base.css          (Base theme - imported by apps)
    ├── db/                  # Database Schema & Client
    │   ├── src/schema.ts         (Drizzle schema)
    │   └── src/client.ts         (Supabase connection)
    ├── utils/               # Shared Helpers
    │   └── Currency formatting, Number compaction, etc.
    └── config/              # Shared TSConfig, Biome config
```

---

## 3. Dependency Management

Uses Bun workspaces. Commands:
```bash
bun install                    # Install all dependencies
bun add react --cwd apps/dashboard  # Add to specific workspace
bun run dev                    # Run all apps
```

---

## 4. Biome Configuration

Single tool for linting and formatting. Commands:
```bash
bun run lint      # Check for issues
bun run format    # Format code
```

---

## 5. Database Management

The project uses Drizzle ORM for database management. Commands (run in `packages/db`):
```bash
bun run db:push       # Push schema changes directly to the database (prototyping)
bun run db:generate   # Generate SQL migrations (production)
bun run db:studio     # Open Drizzle Studio to view/edit data
```

---

## 6. Theming Strategy

- **Base Theme**: `packages/ui/src/base.css` - shared CSS variables and design tokens
- **App Themes**: Each app's `app/tailwind.css` imports base and can override variables
- **Runtime**: `ThemeProvider` supports user-customizable themes (light theme only for now)

---

## 7. Code Style Guidelines

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

## 8. Creating New Apps

```bash
cp -r apps/template apps/[your-app-name]
```

Update `package.json` name and `app/layout.tsx` metadata.