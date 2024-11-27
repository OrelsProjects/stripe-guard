import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/api/_db/db";
import { sendMail } from "@/app/api/_utils/mail/mail";

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
        "orelsmail@gmail.com",
        "StripeGuard",
        "NEW USER HAS REGISTERED",
        `User ${interestedUser} has registered to the platform`,
      );
    } catch (error) {
      console.error("Error sending mail", { error });
    }

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error registering user", { error });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
