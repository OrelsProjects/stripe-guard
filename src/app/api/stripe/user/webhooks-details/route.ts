import prisma from "@/app/api/_db/db";
import { authOptions } from "@/auth/authOptions";
import loggerServer from "@/loggerServer";
import moment from "moment-timezone";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const timeZone = req.nextUrl.searchParams.get("timeZone");
    // if (timeZone) {
    //   moment.tz.setDefault(timeZone);
    // }
    const today = moment().startOf("day").toDate().getTime() / 1000;
    const endOfDay = moment().endOf("day").toDate().getTime() / 1000;

    const userWebhookEvents = await prisma.userWebhookEvent.findMany({
      where: {
        userId: session.user.userId,
        created: {
          gte: today,
          lte: endOfDay,
        },
      },
    });

    return NextResponse.json(userWebhookEvents, { status: 200 });
  } catch (error: any) {
    loggerServer.error(
      "Error getting webhook details",
      session?.user?.userId || "Unknown user",
      error,
    );
  }
}
