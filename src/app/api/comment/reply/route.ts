import { replayCommentSchema } from "@/type/comment";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
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
    return NextResponse.json(reply, {status: 200});
  } catch (err: any) {
    return NextResponse.json(err.message);
  }
};
