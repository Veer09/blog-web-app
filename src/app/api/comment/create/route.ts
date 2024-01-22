import { commentUploadSchema } from "@/type/comment";
import { auth } from "@clerk/nextjs";
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
    return NextResponse.json({ commentData }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err: err }, { status: 405 });
  }
};
