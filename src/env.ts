import "dotenv/config";
import z from "zod";

const EnvSchema = z.object({
  NODE_ENV: z
    .literal(["development", "preview", "production"])
    .default("development"),

  AUTH_SECRET: z.string(),

  DATABASE_URL: z.string().nonempty(),
  DATABASE_URL_UNPOOLED: z.string().nonempty(),

  SANITY_WEBHOOK_SECRET: z.string().nonempty(),
});

const Env = EnvSchema.parse(process.env);

export default Env;
