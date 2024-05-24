import prisma from "@/lib/db";
import { commentDeleteSchema, commentUploadSchema, replayCommentSchema } from "@/type/comment";
import { auth } from "@clerk/nextjs";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const comment = commentUploadSchema.safeParse(body);

  if (!comment.success) {
    console.log(comment.error);
    return NextResponse.json(comment.error, { status: 405 });
  }

  const { userId } = auth();
  if (!userId) {
    return NextResponse.json("Unauthorized", { status: 400 });
  }

  try {
    const commentData = await prisma.comment.create({
      data: {
        content: comment.data.comment,
        blog_id: comment.data.blogId,
        user_id: userId,
      },
    });
    revalidateTag(`comments:${comment.data.blogId}`);
    return NextResponse.json({ commentData }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err: err }, { status: 405 });
  }
};

export const DELETE = async (req: NextRequest) => {
    const body = await req.json();
    const payload = commentDeleteSchema.safeParse(body.payload);
    if (!payload.success) return NextResponse.json("Invalid Request");
  
    const { userId } = auth();
    if (!userId) return NextResponse.json("Unautherized User");
    if (userId !== payload.data.userId) return NextResponse.json("Invalid User");
    try {
      await prisma.comment.delete({
        where: {
          id: payload.data.comment,
        },
      });
      revalidateTag(`comments:${payload.data.blogId}`);
      return NextResponse.json("sucess");
    } catch (err: any) {
      return NextResponse.json(err.message);
    }
  };

  export const PUT = async (req: NextRequest) => {
    const body = await req.json();
    const payload = replayCommentSchema.safeParse(body);
    if (!payload.success) return NextResponse.json("Invalid Request");
  
    const { userId } = auth();
    if (!userId) return NextResponse.json("Unauthorized");
    try {
      const reply = await prisma.comment.update({
        where: {
          id: payload.data.commentId,
        },
        data: {
          replies: {
            create: {
              content: payload.data.comment,
              user_id: userId,
              blog_id: payload.data.blogId,
            },
          },
        },
      });
      revalidateTag(`comments:${payload.data.blogId}`)
      return NextResponse.json(reply, {status: 200});
    } catch (err: any) {
      return NextResponse.json(err.message);
    }
  };