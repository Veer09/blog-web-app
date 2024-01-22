import { commentGetResponseSchema, commentGetSchema } from "@/type/comment";
import { clerkClient } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { comment } from "postcss";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const blogId = commentGetSchema.safeParse(body.blogId);
  if (!blogId.success) {
    return NextResponse.json("Invalid Request");
  }
  try {
    const blogComment = await prisma.blog.findFirst({
      where: {
        id: blogId.data,
      },
      select: {
        comments: {
          where: {
            reply_id: null
          },
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
    if (!blogComment) {
      return NextResponse.json("Invalid Blog Details");
    }
    const comments = blogComment.comments.map(async (comment) => {
      return {
        comment,
        user: await clerkClient.users.getUser(comment.user_id),
      };
    });
    const response = commentGetResponseSchema.parse(
      await Promise.all(comments)
    );
    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    return NextResponse.json(err);
  }
};
