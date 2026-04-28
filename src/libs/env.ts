import "dotenv/config";
import z from "zod";

const EnvSchema = z.object({
  NODE_ENV: z
    .literal(["development", "preview", "production"])
    .default("development"),

  NEXTAUTH_URL: z.url(),
  NEXTAUTH_SECRET: z.string(),

  DATABASE_URL_UNPOOLED: z.string().nonempty(),
});

const Env = EnvSchema.parse(process.env);

export default Env;
