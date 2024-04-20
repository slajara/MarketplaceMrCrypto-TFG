// Imports
// ========================================================
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
  type Session,
} from "next-auth";
// SIWE Integration
import type { CtxOrReq } from "next-auth/client/_utils";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";
import { SiweMessage } from "siwe";

// (Will add back)
import { prisma } from "@acme/db";

// Types
// ========================================================
/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      address: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    address: string;
  }
}
declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    id: string;
    address: string;
  }
}

// Auth Options
// ========================================================
/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: (ctxReq: CtxOrReq) => NextAuthOptions = ({
  req,
}) => ({
  callbacks: {
    // token.sub will refer to the id of the wallet address
    session: ({ session, token }) =>
      ({
        ...session,
        user: {
          ...session.user,
          id: token.id,
          address: token.address,
        },
      } as Session & { user: { id: string; address: string } }),

    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.address = user.address;
      }

      return token;
    },
  },
  providers: [
    CredentialsProvider({
      name: "Ethereum",
      type: "credentials", // default for Credentials
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },
      authorize: async (credentials) => {
        try {
          const siwe = new SiweMessage(
            JSON.parse(credentials?.message || "{}") as Partial<SiweMessage>,
          );
          const nextAuthUrl = new URL(process.env.NEXTAUTH_URL ?? "");

          const fields = await siwe.verify({
            signature: credentials?.signature || "",
            domain: nextAuthUrl.host,
            nonce: await getCsrfToken({ req }),
          });

          //Check if user exists
          let user = await prisma.user.findUnique({
            where: {
              address: fields.data.address,
            },
          });
          // Create new user if doesn't exist
          if (!user) {
            user = await prisma.user.create({
              data: {
                address: fields.data.address,
              },
            });
            // create account
            await prisma.account.create({
              data: {
                userId: user.id,
                type: "credentials",
                provider: "Ethereum",
                providerAccountId: fields.data.address,
              },
            });
          }

          return {
            id: fields.data.address,
            address: fields.data.address,
          };
        } catch (error) {
          // Uncomment or add logging if needed
          console.error({ error });
          return null;
        }
      },
    }),
  ],
});

// Auth Session
// ========================================================
/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = async (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  // Changed from authOptions to authOption(ctx)
  // This allows use to retrieve the csrf token to verify as the nonce
  return getServerSession(ctx.req, ctx.res, authOptions(ctx));
};
