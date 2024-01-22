import { commentGetResponseSchema, repliesGetSchema } from "@/type/comment";
import { clerkClient } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const payload = repliesGetSchema.safeParse(body.commentId);
  if (!payload.success) return NextResponse.json("Invalid Request");
  try {
    const replyComment = await prisma.comment.findFirst({
      where: {
        id: payload.data,
      },
      select: {
        replies: {         
          include: {
            _count: {
              select: {
                replies: true,
              },
            },
          },
        },
      },
    });
    if (!replyComment) return NextResponse.json("Invalid Body");
    const comments = replyComment.replies.map(async (comment) => {
      return {
        comment,
        user: await clerkClient.users.getUser(comment.user_id),
      };
    });
    const response = commentGetResponseSchema.parse(
      await Promise.all(comments)
    );
    return NextResponse.json(response);
  } catch (err: any) {
    return NextResponse.json(err.message);
  }
};
