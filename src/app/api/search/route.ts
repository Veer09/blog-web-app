import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { redis } from "@/lib/redis";
import { cachedUser } from "@/type/user";
export const GET = async (req: NextRequest) => {
  const query = req.nextUrl.searchParams;
  const name = query.get("name");
  const type = query.get("type");
  if (name) {
    if (type === "book") {
      const books = await prisma.book.findMany({
        where: {
          OR: [
            {
              title: {
                contains: name,
              },
            },
            {
              topic_name: {
                contains: name,
              },
            },
          ],
        },
        select: {
          id: true,
          title: true,
          topic_name: true,
          _count: {
            select: {
              followers: true,
            },
          },
          author_id: true,
        },
        take: 10,
        orderBy: {
          followers: {
            _count: "desc",
          },
        },
      });
      const redisPipe = redis.pipeline();
      books.forEach((book) => {
        redisPipe.hgetall(`user:${book.author_id}`);
      });
      const authors: cachedUser[] = await redisPipe.exec();
      const response: any[] = [];
      books.forEach((book, index) => {
        response.push({
          ...book,
          author: authors[index],
        });
      });
      return NextResponse.json({ response }, { status: 200 });
    } else if (type === "chapter") {
      const chapters = await prisma.chapter.findMany({
        where: {
          title: {
            contains: name,
          },
        },
        select: {
          title: true,
          user_id: true,
          id: true,
          _count: {
            select: {
              book: true,
            },
          },
        },
        take: 10,
        orderBy: {
          book: {
            _count: "desc",
          },
        },
      });
      const redisPipe = redis.pipeline();
      chapters.forEach((chapter) => {
        redisPipe.hgetall(`user:${chapter.user_id}`);
      });
      const authors: cachedUser[] = await redisPipe.exec();
      const response: any[] = [];
      chapters.forEach((chapter, index) => {
        response.push({
          ...chapter,
          author: authors[index],
        });
      });

      return NextResponse.json({ response }, { status: 200 });
    } else if (type === "blog") {
      const blogs = await prisma.blog.findMany({
        where: {
          title: {
            contains: name,
          },
        },
        select: {
          title: true,
          user_id: true,
          id: true,
          _count: {
            select: {
              like: true,
            },
          },
        },
        take: 10,
        orderBy: {
          like: {
            _count: "desc",
          },
        },
      });

      const redisPipe = redis.pipeline();
      blogs.forEach((blog) => {
        redisPipe.hgetall(`user:${blog.user_id}`);
      });
      const authors: cachedUser[] = await redisPipe.exec();
      const response: any[] = [];
      blogs.forEach((blog, index) => {
        response.push({
          ...blog,
          author: authors[index],
        });
      });
      return NextResponse.json({ response }, { status: 200 });
    }
  }
  return NextResponse.json({ message: "No data found" }, { status: 404 });
};
