import prisma from "@/lib/db";
import { redis } from "@/lib/redis";
import { savedBySchema } from "@/type/user";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const payload = savedBySchema.safeParse(body.payload);
  if (!payload.success) return NextResponse.json("Invalid Request!");
  const { userId } = auth();
  if (!userId) return NextResponse.json("Unautherized!");

  const saved = await redis.sismember(`user:${userId}:saved`, payload.data);

  if (!saved) {
    return NextResponse.json({
      status: 403,
      data: "Blog isn't saved!",
    });
  }

  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        saved_blog: {
          disconnect: {
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
