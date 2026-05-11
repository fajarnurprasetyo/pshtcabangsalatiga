import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcrypt";
import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
// import Facebook from "next-auth/providers/facebook";
// import Google from "next-auth/providers/google";
import { cookies } from "next/headers";
import prisma from "./prisma";

export class UserNotFound extends CredentialsSignin {
  code = "not-found";
  constructor(public username: string) {
    super(`User with username '${username}' not found.`);
  }
}

export class InvalidCredentials extends CredentialsSignin {
  code = "invalid-credentials";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  // experimental: { enableWebAuthn: true },
  session: { strategy: "jwt" },
  adapter: {
    ...PrismaAdapter(prisma),
    // TODO: Need fix this
    // @ts-expect-error: ignore for now
    createUser(user) {
      return prisma.user.create({
        data: {
          email: user.email,
          emailVerified: new Date(),
          image: user.image,
          person: {
            create: {
              name: user.name,
            },
          },
        },
      });
    },
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        login: {},
        password: {},
        remember: {},
      },
      async authorize(cred) {
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: cred.login as string },
              { username: cred.login as string },
              { phone: cred.login as string },
            ],
            encryptedPassword: { not: null },
            deletedAt: null,
          },
          include: {
            accounts: true,
            person: true,
            branch: true,
          },
        });

        if (!user) {
          throw new UserNotFound(cred.login as string);
        }

        const { encryptedPassword, ...publicUser } = user;

        if (!bcrypt.compareSync(cred.password as string, encryptedPassword!)) {
          throw new InvalidCredentials();
        }

        return publicUser;
      },
    }),
    // Google({
    //   authorization: {
    //     params: {
    //       prompt: "consent",
    //       access_type: "offline",
    //       response_type: "code",
    //     },
    //   },
    // }),
    // Facebook,
    // TikTok,
    // Passkey,
  ],
  callbacks: {
    signIn({ account, profile }) {
      if (account?.provider === "google") {
        return !!profile?.email_verified;
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user && account) {
        const rememberCookie = (await cookies()).get("remember-session");
        const remember = rememberCookie?.value === "true";

        if (account.provider !== "credentials") {
          user.person = await prisma.person.findUniqueOrThrow({
            where: { userId: user.id },
          });
        }

        // @ts-expect-error: Ignore user.image is undefined
        token.user = user;
      }

      return token;
    },
    session({ session, token }) {
      if (token.user) {
        // @ts-expect-error: Ignore token.user.email is null
        session.user = token.user;
      }

      return session;
    },
  },
});
