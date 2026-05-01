import { UserRole } from "@/generated/prisma/enums";
import z from "zod";

export const UsernameSchema = z
  .string()
  .trim()
  .regex(/^[a-zA-Z0-9._]{5,}$/, "Nama pengguna tidak valid");

export const UserRegisterSchema = z.object({
  name: z.string().min(3, "Nama lengkap harus diisi"),
  username: UsernameSchema,
  "branch-id": z.coerce.number("Cabang harus dipilih"),
  "sub-branch": z.preprocess(
    (value) => (value !== "" ? value : null),
    z.string().nonempty().nullable(),
  ),
  role: z.enum(UserRole),
  password: z.string().min(8, "Kata sandi harus diisi"),
});
