import { PrismaAdapter } from "@auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "~/server/db";
import bcrypt from "bcryptjs";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      username: string;
      emailVerified: boolean | null;
      image: string | null;
    };
  }
  interface User {
    id: string;
  }
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/signin",
    signOut: "/signin",
    newUser: "/signup",
    error: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    session: async ({ session, token }) => {
      const dbUser = await db.user.findUnique({
        where: { id: token.id as string },
        select: { name: true, image: true, username: true, emailVerified: true },
      });

      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          username: dbUser?.username ?? null,
          emailVerified: dbUser?.emailVerified ?? null,
          image: dbUser?.image ?? null,
        },
      };
    },
  },
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const user = await db.user.findFirst({
          where: {
            OR: [
              { email: credentials.email },
              { username: credentials.email },
            ],
          },
        });

        if (!user) {
          throw new Error("No user found with this email");
        }

        if (!user.password) {
          throw new Error("User has no password set (maybe OAuth account?)");
        }

        //eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          username: user.username,
        };
      },
    }),
  ],
};

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};