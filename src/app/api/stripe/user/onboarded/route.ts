import prisma from "@/app/api/_db/db";
import { authOptions } from "@/auth/authOptions";
import loggerServer from "@/loggerServer";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const userStripeCredentials = await prisma.userStripeCredentials.findFirst({
      where: {
        userId: session?.user?.userId,
      },
    });

    const isUserOnboarded = !!userStripeCredentials;

    return NextResponse.json(isUserOnboarded, { status: 200 });
  } catch (error: any) {
    loggerServer.error(
      "Error getting onboarded status",
      session?.user?.userId || "Unknown user",
      error,
    );
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
