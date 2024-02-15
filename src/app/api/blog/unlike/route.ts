import { savedBySchema } from "@/type/user";
import { auth } from "@clerk/nextjs";
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
    if (!isLiked) {
        return NextResponse.json({
            status: 400,
            data: "Blog isn't liked!",
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
