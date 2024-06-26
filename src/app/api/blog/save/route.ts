import prisma from "@/lib/db";
import { redis } from "@/lib/redis";
import { savedBySchema } from "@/type/user";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const payload = savedBySchema.safeParse(body.payload);
  if (!payload.success) return NextResponse.json("Invalid Request!");
  const { userId } = auth();
  if (!userId) return NextResponse.json("Unautherized!");

  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        saved_blog: {
          connect: {
            id: payload.data,
          },
        },
      },
    });

    return NextResponse.json("success");
  } catch (err: any) {
    return NextResponse.json(err.message);
  }
};
