import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import Env from "./env";

const pool = new pg.Pool({ connectionString: Env.DATABASE_URL });

const adapter = new PrismaPg(pool);

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

export default prisma;

if (Env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
