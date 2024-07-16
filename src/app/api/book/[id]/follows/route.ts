import prisma from "@/lib/db";
import { ApiError, ErrorTypes, handleApiError } from "@/lib/error";
import { redis } from "@/lib/redis";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { userId } = auth();
  try {
    if (!userId) {
      throw new ApiError(
        "Unauthorized!! Login first to access",
        ErrorTypes.Enum.unauthorized
      );
    }

    await prisma.book.update({
      where: {
        id: params.id,
      },
      data: {
        followers: {
          connect: {
            id: userId,
          },
        },
      },
    });

    await redis.hincrby(`book:${params.id}:meta`, "followers", 1);

    return NextResponse.json({ message: "Followed" }, { status: 200 });
  } catch (err) {
    handleApiError(err);
  }
};
