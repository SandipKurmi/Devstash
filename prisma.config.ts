import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // DIRECT_URL bypasses the connection pooler for CLI operations (migrate, generate)
    url: process.env.DIRECT_URL ?? "",
  },
});
