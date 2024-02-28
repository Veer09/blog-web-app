import { redis } from "@/lib/redis";
import { savedBySchema } from "@/type/user";
import { auth } from "@clerk/nextjs";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { payload } = await req.json();
    const blogId = savedBySchema.safeParse(payload);
    if (!blogId.success) {
      return NextResponse.json({
        status: 400,
        data: "Invalid Request!",
      });
    }
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({
        status: 401,
        data: "Unautherized!",
      });
    }
    const isLiked = await prisma.like.findUnique({
      where: {
        user_id_blog_id: {
          user_id: userId,
          blog_id: blogId.data,
        },
      },
    });
    if (isLiked) {
      return NextResponse.json({
        status: 400,
        data: "Blog already liked!",
      });
    }
    await prisma.like.create({
      data: {
        user_id: userId,
        blog_id: blogId.data,
      },
    });
    await redis.sadd(`user:${userId}:liked`, blogId.data);
    await redis.hincrby(`blog:${blogId.data}`, "likes", 1);
    revalidateTag(`blog:${blogId.data}`)
    return NextResponse.json({
      status: 200,
      data: {
        message: "Blog liked successfully!!",
      },
    });
  } catch (err: any) {
    return NextResponse.json({
      status: 500,
      data: "Internal Server Error!",
    });
  }
};
