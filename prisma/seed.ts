import "dotenv/config";
import { hash } from "bcryptjs";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...\n");

  // ─── User ─────────────────────────────────────────────────────────────────

  const passwordHash = await hash("12345678", 12);

  const user = await prisma.user.upsert({
    where: { email: "demo@devstash.io" },
    update: {},
    create: {
      email: "demo@devstash.io",
      password: passwordHash,
      emailVerified: new Date(),
      isPro: false,
    },
  });

  console.log("User:", user.email);

  // ─── Clean existing seeded data ───────────────────────────────────────────
  // Items cascade-delete their ItemTag rows automatically.

  await prisma.item.deleteMany({ where: { userId: user.id } });
  await prisma.collection.deleteMany({ where: { userId: user.id } });
  await prisma.tag.deleteMany({ where: { userId: user.id } });
  await prisma.itemType.deleteMany({ where: { isSystem: true } });

  console.log("Cleared existing seed data.");

  // ─── System Item Types ────────────────────────────────────────────────────

  const typeData = [
    { name: "Snippet", icon: "Code",       color: "#3b82f6" },
    { name: "Prompt",  icon: "Sparkles",   color: "#8b5cf6" },
    { name: "Command", icon: "Terminal",   color: "#f97316" },
    { name: "Note",    icon: "StickyNote", color: "#fde047" },
    { name: "File",    icon: "File",       color: "#6b7280" },
    { name: "Image",   icon: "Image",      color: "#ec4899" },
    { name: "Link",    icon: "Link",       color: "#10b981" },
  ];

  const types: Record<string, string> = {};

  for (const t of typeData) {
    const itemType = await prisma.itemType.create({ data: { ...t, isSystem: true } });
    types[t.name] = itemType.id;
  }

  console.log("Item types:", Object.keys(types).join(", "));

  // ─── Helper: create tag ───────────────────────────────────────────────────

  async function tag(name: string): Promise<string> {
    const t = await prisma.tag.upsert({
      where: { userId_name: { userId: user.id, name } },
      update: {},
      create: { name, userId: user.id },
    });
    return t.id;
  }

  // ─── React Patterns — 3 TypeScript snippets ───────────────────────────────

  const reactPatterns = await prisma.collection.create({
    data: { name: "React Patterns", description: "Reusable React patterns and hooks", userId: user.id },
  });

  await prisma.item.create({
    data: {
      title: "useDebounce Hook",
      description: "Debounces a value by a given delay in milliseconds",
      contentType: "text",
      language: "typescript",
      content: `import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}`,
      userId: user.id,
      typeId: types["Snippet"],
      collectionId: reactPatterns.id,
      tags: { create: [{ tagId: await tag("react") }, { tagId: await tag("hooks") }, { tagId: await tag("typescript") }] },
    },
  });

  await prisma.item.create({
    data: {
      title: "Context Provider Pattern",
      description: "Type-safe React context with provider and custom hook",
      contentType: "text",
      language: "typescript",
      content: `import { createContext, useContext, useState, ReactNode } from "react";

interface ThemeContextValue {
  theme: "light" | "dark";
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const toggle = () => setTheme((t) => (t === "light" ? "dark" : "light"));
  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}`,
      userId: user.id,
      typeId: types["Snippet"],
      collectionId: reactPatterns.id,
      tags: { create: [{ tagId: await tag("react") }, { tagId: await tag("context") }, { tagId: await tag("typescript") }] },
    },
  });

  await prisma.item.create({
    data: {
      title: "useLocalStorage Hook",
      description: "Persist state to localStorage with automatic JSON serialisation",
      contentType: "text",
      language: "typescript",
      content: `import { useState } from "react";

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initial;
    } catch {
      return initial;
    }
  });

  const set = (next: T) => {
    setValue(next);
    localStorage.setItem(key, JSON.stringify(next));
  };

  return [value, set] as const;
}`,
      userId: user.id,
      typeId: types["Snippet"],
      collectionId: reactPatterns.id,
      tags: { create: [{ tagId: await tag("react") }, { tagId: await tag("hooks") }, { tagId: await tag("localStorage") }] },
    },
  });

  console.log("Seeded: React Patterns (3 snippets)");

  // ─── AI Workflows — 3 prompts ─────────────────────────────────────────────

  const aiWorkflows = await prisma.collection.create({
    data: { name: "AI Workflows", description: "AI prompts and workflow automations", userId: user.id },
  });

  await prisma.item.create({
    data: {
      title: "Code Review Prompt",
      description: "Structured prompt for thorough AI code review",
      contentType: "text",
      content: `Review the following code and provide feedback on:
1. Correctness — are there any bugs or edge cases missed?
2. Performance — any unnecessary re-renders, N+1 queries, or expensive operations?
3. Security — input validation, auth checks, injection risks
4. Readability — naming, structure, and clarity
5. Suggestions — specific improvements with code examples

Code:
\`\`\`
{{code}}
\`\`\``,
      userId: user.id,
      typeId: types["Prompt"],
      collectionId: aiWorkflows.id,
      tags: { create: [{ tagId: await tag("ai") }, { tagId: await tag("code-review") }, { tagId: await tag("prompts") }] },
    },
  });

  await prisma.item.create({
    data: {
      title: "Documentation Generation Prompt",
      description: "Generate clear JSDoc or markdown docs from source code",
      contentType: "text",
      content: `Generate comprehensive documentation for the following code.
Include:
- A one-line summary
- Parameter descriptions with types
- Return value description
- Usage example
- Any important notes or edge cases

Output as JSDoc comments where applicable, or markdown if it's a module/file overview.

Code:
\`\`\`
{{code}}
\`\`\``,
      userId: user.id,
      typeId: types["Prompt"],
      collectionId: aiWorkflows.id,
      tags: { create: [{ tagId: await tag("ai") }, { tagId: await tag("documentation") }, { tagId: await tag("prompts") }] },
    },
  });

  await prisma.item.create({
    data: {
      title: "Refactoring Assistance Prompt",
      description: "Refactor code for clarity, performance, and modern patterns",
      contentType: "text",
      content: `Refactor the following code with these goals:
- Improve readability and naming
- Apply modern {{language}} idioms and best practices
- Reduce complexity and duplication
- Keep the same external behaviour

Explain each change you make and why.

Code:
\`\`\`
{{code}}
\`\`\``,
      userId: user.id,
      typeId: types["Prompt"],
      collectionId: aiWorkflows.id,
      tags: { create: [{ tagId: await tag("ai") }, { tagId: await tag("refactoring") }, { tagId: await tag("prompts") }] },
    },
  });

  console.log("Seeded: AI Workflows (3 prompts)");

  // ─── DevOps — 1 snippet + 1 command + 2 links ─────────────────────────────

  const devops = await prisma.collection.create({
    data: { name: "DevOps", description: "Infrastructure and deployment resources", userId: user.id },
  });

  await prisma.item.create({
    data: {
      title: "Docker Compose — Node + Postgres",
      description: "Production-ready Docker Compose for a Node.js app with PostgreSQL",
      contentType: "text",
      language: "yaml",
      content: `version: "3.9"
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:password@db:5432/appdb
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: appdb
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  pgdata:`,
      userId: user.id,
      typeId: types["Snippet"],
      collectionId: devops.id,
      tags: { create: [{ tagId: await tag("docker") }, { tagId: await tag("devops") }, { tagId: await tag("postgres") }] },
    },
  });

  await prisma.item.create({
    data: {
      title: "Deploy with Docker Compose",
      description: "Pull latest, rebuild, and restart containers with zero downtime",
      contentType: "text",
      content: "git pull origin main && docker compose pull && docker compose up -d --build && docker compose ps",
      userId: user.id,
      typeId: types["Command"],
      collectionId: devops.id,
      tags: { create: [{ tagId: await tag("docker") }, { tagId: await tag("deployment") }, { tagId: await tag("devops") }] },
    },
  });

  await prisma.item.create({
    data: {
      title: "Docker Documentation",
      description: "Official Docker docs — reference for Compose, Dockerfile, and CLI",
      contentType: "text",
      url: "https://docs.docker.com",
      userId: user.id,
      typeId: types["Link"],
      collectionId: devops.id,
      tags: { create: [{ tagId: await tag("docker") }, { tagId: await tag("docs") }] },
    },
  });

  await prisma.item.create({
    data: {
      title: "GitHub Actions Docs",
      description: "CI/CD workflows with GitHub Actions — events, jobs, and runners",
      contentType: "text",
      url: "https://docs.github.com/en/actions",
      userId: user.id,
      typeId: types["Link"],
      collectionId: devops.id,
      tags: { create: [{ tagId: await tag("ci-cd") }, { tagId: await tag("github") }, { tagId: await tag("devops") }] },
    },
  });

  console.log("Seeded: DevOps (1 snippet, 1 command, 2 links)");

  // ─── Terminal Commands — 4 commands ───────────────────────────────────────

  const terminalCommands = await prisma.collection.create({
    data: { name: "Terminal Commands", description: "Useful shell commands for everyday development", userId: user.id },
  });

  await prisma.item.create({
    data: {
      title: "Git — Undo Last Commit",
      description: "Undo the last commit but keep changes staged",
      contentType: "text",
      content: "git reset --soft HEAD~1",
      userId: user.id,
      typeId: types["Command"],
      collectionId: terminalCommands.id,
      tags: { create: [{ tagId: await tag("git") }, { tagId: await tag("shell") }] },
    },
  });

  await prisma.item.create({
    data: {
      title: "Docker — Remove All Stopped Containers",
      description: "Prune stopped containers, dangling images, and unused networks",
      contentType: "text",
      content: "docker system prune -f",
      userId: user.id,
      typeId: types["Command"],
      collectionId: terminalCommands.id,
      tags: { create: [{ tagId: await tag("docker") }, { tagId: await tag("shell") }] },
    },
  });

  await prisma.item.create({
    data: {
      title: "Kill Process on Port",
      description: "Find and kill whatever process is listening on a given port",
      contentType: "text",
      content: "lsof -ti:3000 | xargs kill -9",
      userId: user.id,
      typeId: types["Command"],
      collectionId: terminalCommands.id,
      tags: { create: [{ tagId: await tag("process") }, { tagId: await tag("shell") }, { tagId: await tag("network") }] },
    },
  });

  await prisma.item.create({
    data: {
      title: "Bun — Update All Dependencies",
      description: "Update all packages to their latest allowed versions and reinstall",
      contentType: "text",
      content: "bun update && bun install",
      userId: user.id,
      typeId: types["Command"],
      collectionId: terminalCommands.id,
      tags: { create: [{ tagId: await tag("bun") }, { tagId: await tag("shell") }, { tagId: await tag("dependencies") }] },
    },
  });

  console.log("Seeded: Terminal Commands (4 commands)");

  // ─── Design Resources — 4 links ───────────────────────────────────────────

  const designResources = await prisma.collection.create({
    data: { name: "Design Resources", description: "UI/UX resources and references", userId: user.id },
  });

  await prisma.item.create({
    data: {
      title: "Tailwind CSS Docs",
      description: "Full utility-class reference for Tailwind CSS v4",
      contentType: "text",
      url: "https://tailwindcss.com/docs",
      userId: user.id,
      typeId: types["Link"],
      collectionId: designResources.id,
      tags: { create: [{ tagId: await tag("css") }, { tagId: await tag("tailwind") }, { tagId: await tag("design") }] },
    },
  });

  await prisma.item.create({
    data: {
      title: "shadcn/ui",
      description: "Copy-paste React component library built on Radix UI and Tailwind",
      contentType: "text",
      url: "https://ui.shadcn.com",
      userId: user.id,
      typeId: types["Link"],
      collectionId: designResources.id,
      tags: { create: [{ tagId: await tag("ui") }, { tagId: await tag("components") }, { tagId: await tag("react") }] },
    },
  });

  await prisma.item.create({
    data: {
      title: "Radix UI Primitives",
      description: "Accessible, unstyled UI primitives for building design systems",
      contentType: "text",
      url: "https://www.radix-ui.com",
      userId: user.id,
      typeId: types["Link"],
      collectionId: designResources.id,
      tags: { create: [{ tagId: await tag("ui") }, { tagId: await tag("accessibility") }, { tagId: await tag("design") }] },
    },
  });

  await prisma.item.create({
    data: {
      title: "Lucide Icons",
      description: "Open-source icon library with 1000+ clean SVG icons for React",
      contentType: "text",
      url: "https://lucide.dev",
      userId: user.id,
      typeId: types["Link"],
      collectionId: designResources.id,
      tags: { create: [{ tagId: await tag("icons") }, { tagId: await tag("design") }, { tagId: await tag("react") }] },
    },
  });

  console.log("Seeded: Design Resources (4 links)");
  console.log("\nSeed complete. ✓");
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
