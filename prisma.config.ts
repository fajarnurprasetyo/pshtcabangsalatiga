import { defineConfig } from "prisma/config";
import ServerEnv from "./src/libs/env-server";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed/index.ts",
  },
  datasource: {
    url: ServerEnv.DATABASE_URL_NON_POOLING,
  },
});
