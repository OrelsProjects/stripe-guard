import { Session } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import prisma from "@/app/api/_db/db";
import { UserMetadata } from "@prisma/client";

export async function session({
  session,
  user,
}: {
  session: Session;
  user: AdapterUser;
}) {
  const userId = user.id;
  if (!userId) {
    throw new Error("No user ID found in session");
  }

  const userFromDB = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      meta: true,
    },
  });

  if (userFromDB && !userFromDB.meta) {
    // Create user meta if it doesn't exist
    const meta = await prisma.userMetadata.create({
      data: {
        userId: userId,
        paidStatus: "free",
      },
    });

    userFromDB.meta = { ...meta };
  }

  const userMeta: Partial<UserMetadata> = {
    ...userFromDB?.meta,
    paidStatus: userFromDB?.meta?.paidStatus || "free",
  };

  const newSession: Session = {
    ...session,
    user: {
      ...session.user,
      meta: userMeta,
      userId,
    },
  };

  return newSession;
}
