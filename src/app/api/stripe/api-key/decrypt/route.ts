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
    const user = await prisma.userStripeCredentials.findUnique({
      where: { userId: session.user.userId },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.apiKey) {
      return NextResponse.json({ error: "API Key not found" }, { status: 404 });
    }

    const decryptedKey = user.apiKey;

    return NextResponse.json({ apiKey: decryptedKey });
  } catch (error: any) {
    loggerServer.error(
      "Error getting webhook details",
      session?.user?.userId || "Unknown user",
      error,
    );
  }
}
