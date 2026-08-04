import { copyFileSync, existsSync, mkdirSync } from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function resolveDatabaseUrl(): string {
  const configured = process.env.DATABASE_URL;
  const isServerless = Boolean(
    process.env.NETLIFY ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.VERCEL ||
      process.env.LAMBDA_TASK_ROOT
  );

  if (configured && !configured.startsWith("file:")) {
    return configured;
  }

  if (isServerless) {
    const dest = "/tmp/tasino.db";
    const candidates = [
      path.join(process.cwd(), "prisma", "dev.db"),
      path.join(process.cwd(), "dev.db"),
    ];
    if (!existsSync(dest)) {
      const src = candidates.find((p) => existsSync(p));
      if (!src) {
        throw new Error(
          "Database file not found in deployment. Ensure prisma/dev.db is built and included."
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
  process.env.DATABASE_URL = resolveDatabaseUrl();
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
