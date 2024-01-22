import { commentDeleteSchema } from "@/type/comment";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
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
    return NextResponse.json("sucess");
  } catch (err: any) {
    return NextResponse.json(err.message);
  }
};
