import bcrypt from "bcrypt";
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "./prisma";

export class UserNotFound extends Error {
  constructor(public username: string) {
    super(`User with username '${username}' not found.`);
  }
}

export class InvalidCredentials extends Error {}

export const authOptions: NextAuthOptions = {
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
        if (cred) {
          const user = await prisma.user.findUnique({
            where: { username: cred.username, deletedAt: null },
            include: { branch: true },
          });

          if (!user) {
            throw new UserNotFound(cred.username);
          }

          const { encryptedPassword, ...publicUser } = user;

          if (!bcrypt.compareSync(cred.password, encryptedPassword)) {
            throw new InvalidCredentials();
          }

          return publicUser;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },
    session({ session, token }) {
      if (token.user) session.user = token.user;
      return session;
    },
  },
};
