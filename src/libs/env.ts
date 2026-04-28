import "dotenv/config";
import z from "zod";

const EnvSchema = z.object({
  NODE_ENV: z
    .literal(["development", "preview", "production"])
    .default("development"),

  DATABASE_URL: z.string().nonempty(),

  NEXTAUTH_URL: z.url(),
  NEXTAUTH_SECRET: z.string(),

  SANITY_API_WRITE_TOKEN: z.string().nonempty(),
});

const Env = EnvSchema.parse(process.env);

export default Env;
