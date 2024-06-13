import { bookSchema } from "@/type/book";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { ZodError } from "zod";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import { redis } from "@/lib/redis";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  try {
    const book = bookSchema.parse(body);
    const { userId } = auth();

    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
        }
      },
    });

    await redis.hset(`book:${newBook.id}:meta`, {
      title: newBook.title,
      description: newBook.description,
      topic: book.topic,
      userId: newBook.author_id,
    });

    return NextResponse.json({ id: newBook.id }, { status: 200 });
  } catch (e: any) {
    if(e instanceof ZodError){
      return NextResponse.json({ error: e.errors }, { status: 400 });
    }
    if(e instanceof PrismaClientValidationError){
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Something went wrong!!" }, { status: 500 });
  }
};