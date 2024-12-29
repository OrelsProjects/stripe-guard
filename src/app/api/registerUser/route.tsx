import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/api/_db/db";
import { sendMail } from "@/app/api/_utils/mail/mail";
import loggerServer from "@/loggerServer";

type Body = {
  interestedUser: string;
};

export async function POST(req: NextRequest) {
  try {
    const { interestedUser }: Body = await req.json();

    const existingUser = await prisma.interestedUser.findFirst({
      where: {
        email: interestedUser,
      },
    });

    if (!existingUser) {
      await prisma.interestedUser.create({
        data: {
          email: interestedUser,
        },
      });
    }

    // if (!existingUser) {
    //   await sendWelcomeMail(interestedUser, false);
    // }
    try {
      await sendMail(
        interestedUser,
        process.env.NEXT_PUBLIC_APP_NAME as string,
        "NEW USER HAS REGISTERED",
        `User ${interestedUser} has registered to the platform`,
      );
    } catch (error: any) {
      loggerServer.error("Error sending mail", error);
    }

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 },
    );
  } catch (error: any) {
    loggerServer.error("Error registering user", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
