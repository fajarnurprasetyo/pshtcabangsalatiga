import { type Account, type Person } from "@/generated/prisma/client";
import "next-auth";
import "next-auth/jwt";

type PrismaUser = Omit<
  import("@/generated/prisma/client").User,
  "encryptedPassword"
> & {
  accounts: Account[];
  person: Person | null;
};

declare module "next-auth" {
  interface User extends PrismaUser {}

  interface Session {
    user: PrismaUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: PrismaUser;
  }
}
