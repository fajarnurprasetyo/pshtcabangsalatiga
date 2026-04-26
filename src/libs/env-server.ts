import "dotenv/config";
import z from "zod";
import { ClientEnvSchema } from "./env-client";

const ServerEnvSchema = ClientEnvSchema.and(
  z.object({
    NODE_ENV: z
      .literal(["development", "preview", "production"])
      .default("development"),

    DATABASE_URL: z.string().nonempty(),
    DATABASE_URL_NON_POOLING: z.string().nonempty(),

    NEXTAUTH_URL: z.url(),
    NEXTAUTH_SECRET: z.string(),

    // SANITY_API_VERSION: z.string().nonempty(),
    // SANITY_USE_CDN: z.coerce.boolean(),
  }),
);

const ServerEnv = ServerEnvSchema.parse(process.env);

export default ServerEnv;
