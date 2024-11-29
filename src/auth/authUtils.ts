import { Session } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import prisma from "@/app/api/_db/db";
import { UserMetadata } from "@prisma/client";
import { encrypt } from "@/lib/utils/encryption";

export async function session({
  session,
  user,
}: {
  session: Session;
  user: AdapterUser;
}) {
  return { ...session, user: { ...session.user, userId: user.id } };
}
