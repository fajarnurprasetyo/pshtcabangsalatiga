import "next-auth";

declare module "next-auth" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface User extends Omit<
    import("@/generated/prisma/client").User,
    "encryptedPassword"
  > {}

  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: import("next-auth").User;
  }
}
