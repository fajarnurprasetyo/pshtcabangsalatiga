import z from "zod";

export const ClientEnvSchema = z.object({
  NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().nonempty(),
  NEXT_PUBLIC_SANITY_DATASET: z.string().nonempty(),
  NEXT_PUBLIC_SANITY_API_VERSION: z.string().nonempty().default("2026-04-26"),
});

const ClientEnv = ClientEnvSchema.parse(process.env);

export default ClientEnv;
