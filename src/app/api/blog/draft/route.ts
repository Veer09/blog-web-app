import prisma from "@/lib/db";
import { ApiError, ErrorTypes, handleApiError } from "@/lib/error";
import { blogDraftSchema } from "@/type/blog";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  try {
    const { userId } = auth();
    if (!userId)
      throw new ApiError("Unautherized!!", ErrorTypes.Enum.unauthorized);
    const { name, content } = blogDraftSchema.parse(body);
    await prisma.draft.create({
      data: {
        content: JSON.parse(JSON.stringify(content)),
        user_id: userId,
        name: name,
      },
    });
    return NextResponse.json({ message: "Draft Created" }, { status: 200 });
  } catch (err) {
        const { message, code } = handleApiError(err);
    return NextResponse.json({ error: message }, { status: code });;
  }
};
