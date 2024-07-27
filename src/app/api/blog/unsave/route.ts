import prisma from "@/lib/db";
import { ApiError, ErrorTypes, handleApiError } from "@/lib/error";
import { redis } from "@/lib/redis";
import { savedBySchema } from "@/type/user";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const payload = savedBySchema.parse(body.payload);

  const { userId } = auth();
  if (!userId) throw new ApiError("Unauthorized!!", ErrorTypes.Enum.unauthorized);

  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        saved_blog: {
          disconnect: {
            id: payload,
          },
        },
      },
    });
    return NextResponse.json("success");
  } catch (err: any) {
        const { message, code } = handleApiError(err);
    return NextResponse.json({ error: message }, { status: code });;
  }
};
