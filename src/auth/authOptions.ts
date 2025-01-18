import { AuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";
import { session } from "@/auth/authUtils";
import { MIN_TOKENS } from "@/models/payment";

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  debug: process.env.NODE_ENV === "development",
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_AUTH_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    session,
  },
  events: {
    createUser: async (message) => {
      await prisma.tokensPool.create({
        data: {
          userId: message.user.id,
          tokens: MIN_TOKENS,
          tokensRemaining: MIN_TOKENS,
          lastRefillAt: new Date(),
          tokensUsed: 0,
        },
      });
    },
  },
};
