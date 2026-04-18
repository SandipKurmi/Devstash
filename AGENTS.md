# DevStash

A developer knowledge hub for snippets, command, prompts, notes, files, images, links, and custom types

## Critical Versions

- **Next.js 16.2.3** / **React 19.2.4** — non-standard version. Read `node_modules/next/dist/docs/` before writing code. Heed deprecation notices.

## Commands (bun only)

```bash
bun dev      # Dev server http://localhost:3000
bun build   # Production build
bun start   # Production server
bun lint    # ESLint
```

Do NOT use npm/yarn/pnpm.

## Tailwind CSS v4

**CRITICAL**: v4 uses CSS-based config. NO `tailwind.config.ts` files. Configure theme in `app/globals.css` with `@theme`:

```css
@import "tailwindcss";

@theme {
  --color-primary: oklch(50% 0.2 250);
}
```

## Architecture

- App directory: `app/` (NOT `src/app/`)
- Server components by default, use `'use client'` only when needed
- File organization: `components/`, `actions/`, `lib/`, `types/` (future structure per `context/coding-standards.md`)
- No Prisma yet — planned for MVP

## Lint/Typecheck

ESLint uses `eslint-config-next/core-web-vitals` + `typescript`. Run `bun lint` before commits.
