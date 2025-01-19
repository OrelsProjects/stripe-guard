import { AuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";
import { session } from "@/auth/authUtils";
import { criticalEvents, MIN_TOKENS } from "@/models/payment";
import { getNextRefillAt } from "@/lib/tokens";
import loggerServer from "@/loggerServer";

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
    createUser: async message => {
      const now = new Date();
      try {
        await prisma.tokensPool.create({
          data: {
            userId: message.user.id,
            tokens: MIN_TOKENS,
            tokensRemaining: MIN_TOKENS,
            lastRefillAt: now,
            tokensUsed: 0,
          },
        });
        await prisma.userSettings.create({
          data: {
            userId: message.user.id,
            userCriticalEvents: criticalEvents,
            emailWebhookNotifications: true,
            emailToNotify: message.user.email,
            frequency: "daily",
          },
        });
      } catch (error: any) {
        await prisma.user.delete({
          where: {
            id: message.user.id,
          },
        });
        loggerServer.error("Error creating user", error, {
          errorMessage: error.message,
          user: JSON.stringify(message.user),
        });
        throw error;
      }
    },
  },
};
