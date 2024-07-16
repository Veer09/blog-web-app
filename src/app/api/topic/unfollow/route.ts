import { TopicFollowSchema } from "@/type/topic";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redis } from "@/lib/redis";
import { ApiError, ErrorTypes, handleApiError } from "@/lib/error";
export const POST = async (req: NextRequest) => {
  try {
    const { payload } = await req.json();
    const topicName = TopicFollowSchema.parse(payload);

    const { userId } = auth();
    if (!userId) {
      throw new ApiError(
        "Unauthorized!! Login first to access",
        ErrorTypes.Enum.unauthorized
      );
    }


    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        topics: {
          disconnect: {
            name: topicName,
          },
        },
      },
    });
    await redis.hincrby(`topic:${topicName}`, "followers", -1);
    return NextResponse.json({ message: "sucess" }, { status: 200 });
  } catch (err: any) {
    handleApiError(err);
  }
};
