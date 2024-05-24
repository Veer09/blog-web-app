import { TopicFollowSchema } from "@/type/topic";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redis } from "@/lib/redis";
export const POST = async (req: NextRequest) => {
  try {
    const { payload } = await req.json();
    const topicName = TopicFollowSchema.safeParse(payload);
    if (!topicName.success)
      return NextResponse.json({ error: "Invalid topicName" }, { status: 400 });

    const { userId } = auth();
    if (!userId)
      return NextResponse.json({ error: "User Unauthorized" }, { status: 401 });

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        topics: {
          disconnect: {
            name: topicName.data,
          },
        },
      },
    });
    await redis.hincrby(`topic:${topicName.data}`, "followers", -1);
    return NextResponse.json({ message: "sucess" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ err: err.message }, { status: 400 });
  }
};
