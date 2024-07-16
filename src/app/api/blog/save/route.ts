import prisma from "@/lib/db";
import { ApiError, ErrorTypes, handleApiError } from "@/lib/error";
import { savedBySchema } from "@/type/user";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const payload = savedBySchema.parse(body);

  const { userId } = auth();
  if (!userId)
    throw new ApiError("Unauthorized!!", ErrorTypes.Enum.unauthorized);

  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        saved_blog: {
          connect: {
            id: payload,
          },
        },
      },
    });

    return NextResponse.json("success");
  } catch (err: any) {
    handleApiError(err);
  }
};
