import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { withAccelerate } from "@prisma/extension-accelerate";
import pg from "pg";
import Env from "./env";

const pool = new pg.Pool({ connectionString: Env.DATABASE_URL });

const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter }).$extends(withAccelerate());

export default prisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
