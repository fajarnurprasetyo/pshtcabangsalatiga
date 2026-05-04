import "dotenv/config";
import z from "zod";

const EnvSchema = z.object({
  NODE_ENV: z
    .literal(["development", "preview", "production"])
    .default("development"),

  AUTH_SECRET: z.string().nonempty(),

  AUTH_GOOGLE_ID: z.string().nonempty(),
  AUTH_GOOGLE_SECRET: z.string().nonempty(),

  ADMIN_USERNAME: z.string().optional(),
  ADMIN_PASSWORD: z.string().optional(),

  BAILEYS_URL: z.string().optional(),
  BAILEYS_SECRET: z.string().optional(),

  DATABASE_URL: z.string().nonempty(),
  DATABASE_URL_UNPOOLED: z.string().nonempty(),

  SANITY_WEBHOOK_SECRET: z.string().nonempty(),
  NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().nonempty(),
  NEXT_PUBLIC_SANITY_DATASET: z.string().nonempty(),
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string().nonempty(),
});

const Env = EnvSchema.parse(process.env);

export default Env;
