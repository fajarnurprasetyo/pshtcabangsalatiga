import "next-auth";
import "next-auth/jwt";

export type PrismaUser = Omit<
  import("@/generated/prisma/client").User,
  "encryptedPassword"
> & {};

declare module "next-auth" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
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
