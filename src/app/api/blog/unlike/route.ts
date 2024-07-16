import prisma from "@/lib/db";
import { ApiError, ErrorTypes, handleApiError } from "@/lib/error";
import { redis } from "@/lib/redis";
import { savedBySchema } from "@/type/user";
import { auth } from "@clerk/nextjs";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { payload } = await req.json();
    const blogId = savedBySchema.parse(payload);

    const { userId } = auth();
    if (!userId)
      throw new ApiError("Unauthorized!!", ErrorTypes.Enum.unauthorized);

    await prisma.like.delete({
      where: {
        user_id_blog_id: {
          user_id: userId,
          blog_id: blogId,
        },
      },
    });
    await redis.hincrby(`blog:${blogId}`, "likes", -1);

    return NextResponse.json({
      status: 200,
      data: {
        message: "Blog unliked successfully!!",
      },
    });
  } catch (err: any) {
    handleApiError(err);
  }
};
