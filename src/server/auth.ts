import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import DiscordProvider from "next-auth/providers/discord";
import CredentialsProvider from "next-auth/providers/credentials";

import { env } from "~/env.mjs";
import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      // ...other properties
      // role: UserRole;
    };
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

const adapter = PrismaAdapter(db);

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    // jwt: ({ account, token, user }) => ({
    //     ...token,
    //     sub: user.id,
    // }),
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
  jwt: {
    encode: async ({ secret, token, maxAge }) => {
      const newToken = jwt.sign(token as object, secret, { 
        algorithm: "HS256",
        expiresIn: maxAge,
      });

      let session;
      if (token != null && typeof token.sub == "string" && adapter.createSession != undefined) {
        session = await adapter.createSession({
          userId: token.sub,
          sessionToken: newToken,
          expires: new Date(new Date().getTime() + ((maxAge ?? 0) * 1000)),
        });
      }

      return newToken;
    }
  },
  adapter,
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async function (cred, req) {
        const user = await db.user.findFirst({ where: {
          email: cred!.email,
        } });

        if (!user) return null;

        const compare = await bcrypt.compare(cred!.password, user.password as string);

        if (!compare) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      }
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  theme: {
    logo: "/logo.jpeg",
    brandColor: "#3B3B98",
    colorScheme: "light",
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
