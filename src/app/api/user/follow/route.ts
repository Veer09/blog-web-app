import prisma from "@/lib/db";
import { ApiError, ErrorTypes, handleApiError } from "@/lib/error";
import { qstashClient } from "@/lib/qstash";
import { redis } from "@/lib/redis";
import { UserFollowSchema } from "@/type/user";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { payload } = await req.json();
    const followerId = UserFollowSchema.parse(payload);
    const { userId } = auth();
    if (!userId) {
      throw new ApiError(
        "Unauthorized!! Login first to access",
        ErrorTypes.Enum.unauthorized
      );
    }

    if (followerId === userId)
      throw new ApiError(
        "User can't follow it's self",
        ErrorTypes.Enum.bad_request
      );
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        following: {
          connect: {
            id: followerId,
          },
        },
      },
    });
    await redis.hincrby(`user:${followerId}`, "followers", 1);
    const publishUrl = req.url.split("/").slice(0, 3).join("/");
    await qstashClient.publishJSON({
      url: `${publishUrl}/api/qstash/follow-user`,
      body: {
        userId,
        followerId: followerId,
      },
    });
    return NextResponse.json({ message: "User followed" }, { status: 200 });
  } catch (err: any) {
    handleApiError(err);
  }
};
