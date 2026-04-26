import { InvalidCredentials, UserNotFound } from "@/shared/auth-error";
import bcrypt from "bcrypt";
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./prisma";

const authOptions: NextAuthOptions = {
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

          if (!bcrypt.compareSync(cred.password, user.encryptedPassword)) {
            throw new InvalidCredentials();
          }

          return {
            id: user.id,
            name: user.name,
            username: user.username,
            branch: user.branch,
            subBranch: user.subBranch,
            roles: user.roles,
            email: user.email,
            emailConfirmedAt: user.emailConfirmedAt,
            phone: user.phone,
            phoneConfirmedAt: user.phoneConfirmedAt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          };
        }

        return null;
      },
    }),
  ],
};

export default authOptions;
