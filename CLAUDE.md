# Devstash

A developer knowledge hub for snippets, command, prompts, notes, files, images, links, and custom types

## Context files.

Read the following to get the full context of the project.

- @context/project-overview.md
- @context/coding-standards.md
- @context/ai-interaction.md
- @context/current-feature.md

## Critical: Non-standard Next.js version

This project uses **Next.js 16.2.3** with **React 19.2.4** — APIs, conventions, and file structure may differ significantly from training data. Before writing any Next.js code, read the relevant guide in `node_modules/next/dist/docs/`. Heed all deprecation notices encountered.

## Commands

```bash
bun dev        # Start dev server at http://localhost:3000
bun build      # Production build
bun start      # Start production server
bun lint       # Run ESLint (eslint-config-next/core-web-vitals + typescript)
```

The package manager is **bun** (see `bun.lock`). Do not use npm/yarn/pnpm.
