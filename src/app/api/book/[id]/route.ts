import prisma from "@/lib/db";
import { Chapter, chapterListSchema } from "@/type/book";
import { auth } from "@clerk/nextjs";
import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";

const linkNewChapter = async (
  chapters: Chapter[],
  tx: Omit<
    PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >,
  parent: null | string,
  bookId: string,
  userId: string
) => {
  for (let index = 0; index < chapters.length; index++) {
    const chapter = chapters[index];
    //check if chapter is a book
    if (chapter.link && chapter.link.type === "book") {
      //check if parent is chapter then link with chapter
      if (parent) {
        await tx.subBook.create({
          data: {
            chapter_id: parent,
            book_id: chapter.link.id,
            book_number: index + 1,
          },
        });
      } else {
        //if parent is null then link with book
        await tx.bookInclude.create({
          data: {
            book_id: bookId,
            child_id: chapter.link.id,
            child_number: index + 1,
          },
        });
      }
    } else if (!chapter.link) {
      //Create new Chapter
      const { id } = await tx.chapter.create({
        data: {
          title: chapter.name,
          user_id: userId,
          blogs: {
            connect: chapter.blogs.map((blog) => {
              return { id: blog.id };
            }) 
          }
        },
      });

      if (parent) {
        await tx.subChapter.create({
          data: {
            chapter_id: parent,
            subchapter_id: id,
            subchapter_number: index + 1,
          },
        });
      } else {
        await tx.bookChapter.create({
          data: {
            book_id: bookId,
            chapter_id: id,
            chapter_number: index + 1,
          },
        });
      }
      //if there are children means subchapter
      if (chapter.children.length > 0) {
        await linkNewChapter(chapter.children, tx, id, bookId, userId);
      }
    } else {
      //link with chapter with parent chapter
      if (parent) {
        await tx.subChapter.create({
          data: {
            chapter_id: parent,
            subchapter_id: chapter.link.id,
            subchapter_number: index + 1,
          },
        });
      } else {
        //link with book
        await tx.bookChapter.create({
          data: {
            book_id: bookId,
            chapter_id: chapter.link.id,
            chapter_number: index + 1,
          },
        });
      }
    }
  }
};

const executeTransaction = async (
  chapters: Chapter[],
  parent: null | string,
  bookId: string,
  userId: string
) => {
  const tranaction = await prisma.$transaction(async (tx) => {
    await linkNewChapter(chapters, tx, parent, bookId, userId);
  });
};


export const POST = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const body = await req.json();
  try {
    const chapters = chapterListSchema.parse(body);
    const { userId } = auth();

    if (!userId)
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

    //check request is send from the same user and book exists
    const validRequest = await prisma.book.findFirst({
      where: {
        id: params.id,
        author_id: userId,
      },
    });
    if (!validRequest)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await executeTransaction(chapters, null, params.id, userId);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.log(e);
    return NextResponse.json({ error: e }, { status: 400 });
  }
};





