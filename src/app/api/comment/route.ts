import prisma from "@/lib/db";
import { ApiError, ErrorTypes, handleApiError } from "@/lib/error";
import {
  commentDeleteSchema,
  commentUploadSchema,
  replayCommentSchema,
} from "@/type/comment";
import { auth } from "@clerk/nextjs";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  try {
    const comment = commentUploadSchema.parse(body);

    const { userId } = auth();
    if (!userId) {
      throw new ApiError(
        "Unauthorized!! Login first to access",
        ErrorTypes.Enum.unauthorized
      );
    }

    const commentData = await prisma.comment.create({
      data: {
        content: comment.comment,
        blog_id: comment.blogId,
        user_id: userId,
      },
    });
    revalidateTag(`comments:${comment.blogId}`);
    return NextResponse.json({ commentData }, { status: 200 });
  } catch (err) {
    handleApiError(err);
  }
};

export const DELETE = async (req: NextRequest) => {
  const body = await req.json();
  try {
    const payload = commentDeleteSchema.parse(body.payload);

    const { userId } = auth();
    if (!userId) {
      throw new ApiError(
        "Unauthorized!! Login first to access",
        ErrorTypes.Enum.unauthorized
      );
    }
    if (userId !== payload.userId)
      throw new ApiError(
        "You can't delete this comment!",
        ErrorTypes.Enum.forbidden
      );

    await prisma.comment.delete({
      where: {
        id: payload.comment,
      },
    });
    revalidateTag(`comments:${payload.blogId}`);
    return NextResponse.json("sucess");
  } catch (err: any) {
    handleApiError(err);
  }
};

export const PUT = async (req: NextRequest) => {
  const body = await req.json();

  try {
    const payload = replayCommentSchema.parse(body);
    const { userId } = auth();
    if (!userId) return NextResponse.json("Unauthorized");
    if (!userId) {
      throw new ApiError(
        "Unauthorized!! Login first to access",
        ErrorTypes.Enum.unauthorized
      );
    }
    const reply = await prisma.comment.update({
      where: {
        id: payload.commentId,
      },
      data: {
        replies: {
          create: {
            content: payload.comment,
            user_id: userId,
            blog_id: payload.blogId,
          },
        },
      },
    });
    revalidateTag(`comments:${payload.blogId}`);
    return NextResponse.json(reply, { status: 200 });
  } catch (err: any) {
    handleApiError(err);
  }
};
