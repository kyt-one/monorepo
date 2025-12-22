# Claude AI Instructions for Kyt One Project

## Project Documentation

This project has comprehensive documentation that MUST be referenced for all code changes:

### Core Documentation Files

1. **@ai/ai-project-idea.md** - Product Vision & Business Logic
   - Product vision and problem statement
   - Core user flows (Creator and Brand experiences)
   - Business logic and architecture decisions
   - Monetization strategy and pricing tiers
   - Data refresh architecture (Lazy Update + Cron)

2. **@ai/ai-project-structure.md** - Technical Stack & Architecture
   - Complete tech stack (Turborepo, Bun, Next.js 15, Supabase, Drizzle)
   - Monorepo architecture and folder structure
   - Domain routing strategy (Multi-Zone architecture)
   - Dependency management with Bun Catalogs
   - Code style guidelines and best practices
   - Theming strategy

3. **@ai/ai-database-schema.md** - Database Schema & Types
   - Complete database schema with all tables
   - Row Level Security (RLS) policies
   - Relationships and foreign keys
   - Enums and JSON types
   - TypeScript type definitions

## Critical Rules

### 1. Always Reference Documentation First

Before making ANY code changes:
- Review the relevant documentation files above
- Ensure changes align with the product vision
- Follow the established technical architecture
- Use the correct tech stack and patterns

### 2. Keep Documentation Synchronized

**MANDATORY**: Whenever you make changes that affect:

- **Database Schema** → Update `@ai/ai-database-schema.md`
  - New tables, columns, or relationships
  - Changes to RLS policies
  - New enums or JSON types
  - Modified constraints or indexes

- **Project Structure** → Update `@ai/ai-project-structure.md`
  - New apps or packages
  - Changes to folder structure
  - New dependencies or tools
  - Updated routing logic
  - Modified build/dev commands

- **Product Features** → Update `@ai/ai-project-idea.md`
  - New user flows
  - Changes to business logic
  - Modified pricing tiers
  - New features or capabilities
  - Changes to data refresh logic

### 3. Documentation Update Process

When making code changes:

1. **Before coding**: Review relevant docs to understand current state
2. **During coding**: Note what documentation sections will need updates
3. **After coding**: Update ALL affected documentation files in the same session
4. **Verify**: Confirm documentation accurately reflects the new code state

### 4. Documentation Quality Standards

When updating documentation:
- Be specific and detailed
- Include code examples where relevant
- Update table schemas with exact column types
- Document WHY decisions were made, not just WHAT changed
- Keep formatting consistent with existing docs
- Update timestamps or version notes if present

## Tech Stack Reminders

- **Monorepo**: Turborepo with Bun workspaces
- **Runtime**: Bun (not Node.js)
- **Framework**: Next.js 15 App Router
- **Database**: Supabase (PostgreSQL) with Drizzle ORM
- **Styling**: Tailwind CSS v4 (CSS-first, no config file)
- **Components**: shadcn/ui with Radix primitives
- **Linting**: Biome (not ESLint/Prettier)

## Code Style Guidelines

- **Server-first**: Use React Server Components by default
- **TypeScript**: Strict mode, no `any`, use Zod for validation
- **No comments**: Code should be self-documenting (only explain WHY for complex logic)
- **Imports**: Use workspace imports (`@repo/ui`, `@repo/db`, etc.)
- **Tailwind**: Use CSS variables for theming, `cn()` for className merging

## Common Workflows

### Database Changes
```bash
cd packages/db
bun run db:push       # Development: push schema changes
bun run db:generate   # Production: generate migrations
bun run db:studio     # View/edit data in Drizzle Studio
```

### Development
```bash
bun install           # Install dependencies
bun run dev          # Run all apps in dev mode
bun run lint         # Check code with Biome
bun run format       # Format code with Biome
```

## Documentation Sync Checklist

Before completing any task, verify:

- [ ] Code changes align with product vision in `ai-project-idea.md`
- [ ] Tech stack matches specifications in `ai-project-structure.md`
- [ ] Database changes are reflected in `ai-database-schema.md`
- [ ] All three documentation files are synchronized with code
- [ ] No documentation is outdated or contradictory

---

**Remember**: These documentation files are the source of truth. When in doubt, refer to them. When they're wrong, update them immediately.
