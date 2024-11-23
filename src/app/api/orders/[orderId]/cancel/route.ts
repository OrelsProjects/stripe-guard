import prisma from "@/app/api/_db/db";
import { getOrder } from "@/app/api/_utils/payments";
import { authOptions } from "@/auth/authOptions";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import Logger from "@/loggerServer";

export async function POST(
  req: NextRequest,
  { params }: { params: { orderId: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const order = await getOrder(params.orderId);

    await prisma.userOrders.update({
      where: {
        orderId: params.orderId,
      },
      data: {
        status: order.status === "APPROVED" ? order.status : "CANCELLED",
      },
    });

    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    Logger.error("Error sending notification", session.user.userId, {
      data: { error },
    });
    return NextResponse.json(
      { error: "Error sending notification" },
      { status: 500 },
    );
  }
}
