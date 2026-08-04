import { copyFileSync, existsSync, mkdirSync } from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  dbUrl?: string;
};

function isServerlessRuntime() {
  return Boolean(
    process.env.NETLIFY ||
      process.env.NETLIFY_DEV ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.AWS_EXECUTION_ENV ||
      process.env.LAMBDA_TASK_ROOT ||
      process.env.VERCEL ||
      process.env.CONTEXT === "production" ||
      process.env.CONTEXT === "deploy-preview"
  );
}

function resolveDatabaseUrl(): string {
  const configured = process.env.DATABASE_URL;

  // External DB (Postgres/Turso/etc.)
  if (configured && !configured.startsWith("file:")) {
    return configured;
  }

  // On Netlify/Lambda the deploy filesystem is read-only — must use /tmp
  if (isServerlessRuntime()) {
    const dest = "/tmp/tasino.db";
    const candidates = [
      path.join(process.cwd(), "prisma", "dev.db"),
      path.join(process.cwd(), "dev.db"),
      path.join("/var/task", "prisma", "dev.db"),
      path.join("/var/task", "dev.db"),
    ];

    if (!existsSync(dest)) {
      const src = candidates.find((p) => existsSync(p));
      if (!src) {
        throw new Error(
          `Database file not found. cwd=${process.cwd()} candidates=${candidates.join(",")}`
        );
      }
      mkdirSync("/tmp", { recursive: true });
      copyFileSync(src, dest);
    }

    return `file:${dest}`;
  }

  return configured || "file:./dev.db";
}

function createClient() {
  const url = resolveDatabaseUrl();
  process.env.DATABASE_URL = url;
  return new PrismaClient({
    datasources: { db: { url } },
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? createClient();

// Reuse client across warm invocations (including production serverless)
globalForPrisma.prisma = prisma;
