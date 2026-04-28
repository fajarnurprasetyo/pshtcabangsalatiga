import { defineConfig } from "prisma/config";
import Env from "./src/libs/env";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed/index.ts",
  },
  datasource: {
    url: Env.DATABASE_URL,
  },
});
