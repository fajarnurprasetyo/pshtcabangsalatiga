import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "./prisma";

export class UserNotFound extends Error {
  constructor(public username: string) {
    super(`User with username '${username}' not found.`);
  }
}

export class InvalidCredentials extends Error {}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        username: {
          type: "text",
          placeholder: "Username",
        },
        password: {
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(cred) {
        const user = await prisma.user.findUnique({
          where: { username: cred.username as string, deletedAt: null },
          include: { branch: true },
        });

        if (!user) {
          throw new UserNotFound(cred.username as string);
        }

        const { encryptedPassword, ...publicUser } = user;

        if (!bcrypt.compareSync(cred.password as string, encryptedPassword)) {
          throw new InvalidCredentials();
        }

        return publicUser;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      // TODO: Fix AdapterUser handling
      // @ts-expect-error: ignore
      if (user) token.user = user;
      return token;
    },
    session({ session, token }) {
      // TODO: Fix email and emailVerified property
      // @ts-expect-error: ignore
      if (token.user) session.user = token.user;
      return session;
    },
  },
});
