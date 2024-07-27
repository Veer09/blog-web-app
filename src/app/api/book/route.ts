import prisma from "@/lib/db";
import { ApiError, ErrorTypes, handleApiError } from "@/lib/error";
import { redis } from "@/lib/redis";
import { serverForm } from "@/type/book";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  try {
    const book = serverForm.parse(body);
    const { userId } = auth();

    if (!userId)
      throw new ApiError("Unauthorized!!", ErrorTypes.Enum.unauthorized);

    const newBook = await prisma.book.create({
      data: {
        title: book.name,
        description: book.description,
        author: {
          connect: { id: userId },
        },
        topic: {
          connectOrCreate: {
            where: { name: book.topic },
            create: { name: book.topic },
          },
        },
        coverImage: book.url,
      },
    });

    await redis.hset(`book:${newBook.id}:meta`, {
      title: newBook.title,
      description: newBook.description,
      topic: book.topic,
      userId: newBook.author_id,
      id: newBook.id,
      followers: 0,
    });

    return NextResponse.json({ id: newBook.id }, { status: 200 });
  } catch (err) {
    const { message, code } = handleApiError(err);
    return NextResponse.json({ error: message }, { status: code });
  }
};
