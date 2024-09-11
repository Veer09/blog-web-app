import prisma from "@/lib/db";
import { ApiError, ErrorTypes, handleApiError } from "@/lib/error";
import { saveDraftSchema } from "@/type/blog";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const body = await req.json();
  const draftId = params.id;
  try {
    const { userId } = auth();
    if (!userId)
      throw new ApiError("Unauthorized", ErrorTypes.Enum.unauthorized);
    const { content } = saveDraftSchema.parse(body);
    await prisma.draft.update({
      where: {
        id: draftId,
        user_id: userId,
      },
      data: {
        content: JSON.parse(JSON.stringify(content)),
        updatedAt: new Date(),
      },
    });
    return NextResponse.json({ message: "Draft Updated" }, { status: 200 });
  } catch (err) {
    const { message, code } = handleApiError(err);
    return NextResponse.json({ error: message }, { status: code });
  }
};
