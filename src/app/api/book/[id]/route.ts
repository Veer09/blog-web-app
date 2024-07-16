import prisma from "@/lib/db";
import { ApiError, ErrorTypes, handleApiError } from "@/lib/error";
import { redis } from "@/lib/redis";
import {
  cachedBook,
  Chapter,
  chapterListSchema,
  CustomError,
  updateBookSchema,
  UpdateDetails,
} from "@/type/book";
import { auth } from "@clerk/nextjs";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";

const createBook = async (
  bookId: string,
  chapters: Chapter[],
  userId: string
) => {
  await prisma.$transaction(async (tx) => {
    for (let i = 0; i < chapters.length; i++) {
      const chapter = chapters[i];
      if (chapter.link) {
        if (chapter.link.type === "chapter") {
          await tx.bookChapter.create({
            data: {
              book_id: bookId,
              chapter_id: chapter.link.id,
              chapter_number: chapter.chapterNumber,
            },
          });
        } else if (chapter.link.type === "book") {
          const isRecursive = await prisma.bookInclude.findFirst({
            where: {
              book_id: chapter.link.id,
              child_id: bookId,
            },
          });
          if (isRecursive)
            throw new ApiError(
              "Recusrsive Book Inclusion",
              ErrorTypes.Enum.bad_request,
              i
            );
          await tx.bookInclude.create({
            data: {
              book_id: bookId,
              child_id: chapter.link.id,
              child_number: chapter.chapterNumber,
            },
          });
        }
      } else if (chapter.create) {
        const newChapter = await prisma.chapter.create({
          data: {
            title: chapter.title,
            user_id: userId,
            blogs: {
              connect:
                chapter.create.blogs.length !== 0
                  ? chapter.create.blogs.map((blog) => ({ id: blog.id }))
                  : undefined,
            },
          },
        });

        await tx.bookChapter.create({
          data: {
            book_id: bookId,
            chapter_id: newChapter.id,
            chapter_number: chapter.chapterNumber,
          },
        });
        chapter.link = { id: newChapter.id, type: "create", user_id: userId };
        await redis.json.set(`chapter:${newChapter.id}`, "$", chapter);
      }
    }
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
    if (!userId) {
      throw new ApiError(
        "Unauthorized!! Login first to access",
        ErrorTypes.Enum.unauthorized
      );
    }

    //check request is send from the same user and book exists
    const validRequest = await prisma.book.findFirst({
      where: {
        id: params.id,
        author_id: userId,
      },
    });
    if (!validRequest)
      throw new ApiError(
        "You haven't writed this book!!",
        ErrorTypes.Enum.forbidden
      );

    await createBook(params.id, chapters, userId);

    await redis.json.set(`book:${params.id}`, "$", chapters);
    return NextResponse.json({ success: true });
  } catch (err) {
    handleApiError(err);
  }
};

const updateBook = async (
  bookId: string,
  updateDetails: UpdateDetails[],
  userId: string
) => {
  await prisma.$transaction(async (tx) => {
    for (let i = 0; i < updateDetails.length; i++) {
      const update = updateDetails[i];
      try {
        if (update.customChapter) {
          if (update.customChapter.create) {
            const newChapter = await tx.chapter.create({
              data: {
                title: update.customChapter.title,
                user_id: userId,
                blogs: {
                  connect: update.customChapter.create.blogs.map((blog) => ({
                    id: blog.id,
                  })),
                },
              },
            });
            await tx.bookChapter.create({
              data: {
                book_id: bookId,
                chapter_id: newChapter.id,
                chapter_number: update.customChapter.chapterNumber,
              },
            });
            update.customChapter.link = {
              id: newChapter.id,
              type: "create",
              user_id: userId,
            };
            await redis.json.set(
              `chapter:${newChapter.id}`,
              "$",
              update.customChapter
            );
          } else if (update.customChapter.link) {
            if (update.customChapter.link.type === "chapter") {
              await tx.bookChapter.create({
                data: {
                  book_id: bookId,
                  chapter_id: update.customChapter.link.id,
                  chapter_number: update.customChapter.chapterNumber,
                },
              });
            } else if (update.customChapter.link.type === "book") {
              const isRecursive = await tx.bookInclude.findFirst({
                where: {
                  book_id: update.customChapter.link.id,
                  child_id: bookId,
                },
              });
              if (isRecursive)
                throw new ApiError(
                  "Recursive book inclusion!!",
                  ErrorTypes.Enum.recusrsive_book_error,
                  update.number
                );
              await tx.bookInclude.create({
                data: {
                  book_id: bookId,
                  child_id: update.customChapter.link.id,
                  child_number: update.customChapter.chapterNumber,
                },
              });
            }
          }
        }

        if (update.updateChapterNumber) {
          if (update.updateChapterNumber.type === "chapter") {
            await tx.bookChapter.update({
              where: {
                book_id_chapter_id: {
                  book_id: bookId,
                  chapter_id: update.updateChapterNumber.id,
                },
              },
              data: {
                chapter_number: update.updateChapterNumber.chapterNumber,
              },
            });
          }
        }

        if (update.addBlog) {
          await tx.chapter.update({
            where: {
              id: update.addBlog.chapter,
            },
            data: {
              blogs: {
                connect: update.addBlog.id.map((id) => ({ id })),
              },
            },
          });
        }

        if (update.removeBlog) {
          await tx.chapter.update({
            where: {
              id: update.removeBlog.chapter,
            },
            data: {
              blogs: {
                disconnect: update.removeBlog.id.map((id) => ({ id })),
              },
            },
          });
        }

        if (update.updateBlog) {
          await tx.chapter.update({
            where: {
              id: update.updateBlog.chapter,
            },
            data: {
              blogs: {
                connect: update.updateBlog.ids.map((id) => ({ id: id.newId })),
                disconnect: update.updateBlog.ids.map((id) => ({
                  id: id.oldId,
                })),
              },
            },
          });
        }

        if (update.updateChapter) {
          if (update.updateChapter.type === "chapter") {
            await tx.bookChapter.update({
              where: {
                book_id_chapter_id: {
                  book_id: bookId,
                  chapter_id: update.updateChapter.oldId,
                },
              },
              data: {
                chapter_id: update.updateChapter.newId,
              },
            });
          } else {
            const isRecursive = await tx.bookInclude.findFirst({
              where: {
                book_id: update.updateChapter.newId,
                child_id: bookId,
              },
            });
            if (isRecursive)
              throw new ApiError(
                "Reacursive book inclusion!!",
                ErrorTypes.Enum.recusrsive_book_error,
                i
              );
            await tx.bookInclude.update({
              where: {
                book_id_child_id: {
                  book_id: bookId,
                  child_id: update.updateChapter.oldId,
                },
              },
              data: {
                child_id: update.updateChapter.newId,
              },
            });
          }
        }

        if (update.removeChapter) {
          await tx.bookChapter.delete({
            where: {
              book_id_chapter_id: {
                book_id: bookId,
                chapter_id: update.removeChapter.id,
              },
            },
          });
        }
      } catch (err) {
        handleApiError(err);
      }
    }
  });
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const body = await req.json();
  try {
    const { content, updateDetails } = updateBookSchema.parse(body);
    const { userId } = auth();

    if (!userId) {
      throw new ApiError(
        "Unauthorized!! Login first to access",
        ErrorTypes.Enum.unauthorized
      );
    }

    const validRequest = await prisma.book.findFirst({
      where: {
        id: params.id,
        author_id: userId,
      },
    });
    if (!validRequest)
      throw new ApiError(
        "You haven't writed this book!!",
        ErrorTypes.Enum.bad_request
      );

    await updateBook(params.id, updateDetails, userId);
    const cache: cachedBook[] = content;
    await redis.json.set(`book:${params.id}`, "$", cache);
    return NextResponse.json({ success: true });
  } catch (err) {
    handleApiError(err);
  }
};
