import { ApiError, ErrorTypes, handleApiError } from "@/lib/error";
import { redis } from "@/lib/redis";
import { UserFollowAddSchema } from "@/type/user";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  try {
    const { userId, followerId } = UserFollowAddSchema.parse(body);
    if (userId === followerId)
      throw new ApiError(
        "User can't follow it's self!!",
        ErrorTypes.Enum.bad_request
      );
    const userBlogs = await redis.lrange(`user:${userId}:blogs`, 0, -1);
    const redisPipeline = redis.pipeline();
    userBlogs.forEach((blogId) => {
      redisPipeline.zrem(`user:${userId}:feed`, blogId);
    });
    await redisPipeline.exec();
    return NextResponse.json({ message: "User followed" }, { status: 200 });
  } catch (err: any) {
        const { message, code } = handleApiError(err);
    return NextResponse.json({ error: message }, { status: code });;
  }
};
