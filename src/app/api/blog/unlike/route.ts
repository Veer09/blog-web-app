import prisma from "@/lib/db";
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
    await prisma.like.delete({
      where: {
        user_id_blog_id: {
          user_id: userId,
          blog_id: blogId.data,
        },
      },
    });
    await redis.hincrby(`blog:${blogId.data}`, "likes", -1);

    return NextResponse.json({
      status: 200,
      data: {
        message: "Blog unliked successfully!!",
      },
    });
  } catch (err: any) {
    console.log(err);
    return NextResponse.json({
      status: 500,
      data: "Internal Server Error!",
    });
  }
};
