import prisma from "@/app/api/_db/db";
import { MIN_TOKENS } from "@/models/payment";
import { Session } from "next-auth";
import { AdapterUser } from "next-auth/adapters";

export async function session({
  session,
  user,
}: {
  session: Session;
  user: AdapterUser;
}) {
  return { ...session, user: { ...session.user, userId: user.id } };
}
