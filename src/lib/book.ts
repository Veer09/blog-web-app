import { BookMetaData, Chapter } from "@/type/book";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import prisma from "./db";
import { redis } from "./redis";

export type ChapterType = {
  title: string;
  description? : string;
  blogs: { title: string; id: string }[];
  takenFrom?: string; 
  chapterNumber: number;
};


export const getFullBook = async (bookId: string) => {
  const book: BookMetaData | null = await redis.hgetall(`book:${bookId}:meta`);
  if (!book) return null;
  const chapters: ChapterType[] = [];
  await getBook(bookId, chapters, false);
  chapters.sort((a, b) => a.chapterNumber - b.chapterNumber);
  return { title: book.title, description: book.description, topic: book.topic, userId: book.userId  ,chapters };
}
export const getBook = async (bookId: string, chapters: ChapterType[], taken: boolean) => {

  const book:Chapter[] | null = await redis.json.get(`book:${bookId}`);
  const bookData: BookMetaData | null = await redis.hgetall(`book:${bookId}:meta`); 
  if(!bookData) return null;
  if(!book) return null;

  for (const chapter of book) {
    if(chapter.create){
      const chapterData = {
        title: chapter.title,
        blogs: chapter.create.blogs,
        takenFrom: taken ? bookData.title : undefined,
        chapterNumber: chapter.chapterNumber
      }
      chapters.push(chapterData);
    }
    else if(chapter.link){
      if(chapter.link.type === "chapter"){
        const cachedChapter: Chapter | null = await redis.json.get(`chapter:${chapter.link.id}`);
        if(cachedChapter && cachedChapter.create){
          const chapterData = {
            title: cachedChapter.title,
            blogs: cachedChapter.create.blogs,
            takenFrom: taken ? bookData.title : undefined,
            chapterNumber: chapter.chapterNumber
          }
          chapters.push(chapterData);
        }
      }else{
        const cachedBook: Chapter[] | null = await redis.json.get(`book:${chapter.link.id}`);
        if(cachedBook){
          await getBook(chapter.link.id, chapters, true);
        }
      }
    }
  }
}

export const isFollowBook = async (bookId: string) => {
  const { userId } = auth();
  if(!userId) return false;
  const follow = await prisma.user.findFirst({
    where: {
      id: userId,
      followingBooks: {
        some: {
          id: bookId
        }
      }
    }
  })
  return follow ? true : false;
}

export const setBook = async (bookId: string) => {
  const book = await prisma.book.findUnique({
    where: {
      id: bookId,
    },
    select: {
      topic_name: true,
      title: true,
      description: true,
      author_id: true,
      _count: {
        select: {
          followers: true,
        },
      },
      coverImage: true,
      textDark: true
    },
  });
  if (!book) notFound();
  let obj: BookMetaData;
  if(book.coverImage && book.textDark){
    obj = {
      id: bookId,
      title: book.title,
      description: book.description,
      topic: book.topic_name,
      userId: book.author_id,
      followers: book._count.followers,
      coverImage: book.coverImage,
      darkText: book.textDark,
    }
  }else if(book.coverImage && !book.textDark){
    obj = {
      id: bookId,
      title: book.title,
      description: book.description,
      topic: book.topic_name,
      userId: book.author_id,
      followers: book._count.followers,
      coverImage: book.coverImage,
    }
  }else if(!book.coverImage && book.textDark){
    obj = {
      id: bookId,
      title: book.title,
      description: book.description,
      topic: book.topic_name,
      userId: book.author_id,
      followers: book._count.followers,
      darkText: book.textDark,
    }
  }
  else{
    obj = {
      id: bookId,
      title: book.title,
      description: book.description,
      topic: book.topic_name,
      userId: book.author_id,
      followers: book._count.followers,
    }
  }
  await redis.hset(`book:${bookId}:meta`, obj);
  return obj;
};

export const getCachedBook = async (bookId: string) => {
  let book = await redis.hgetall(`book:${bookId}:meta`);
  if (!book) {
    book = await setBook(bookId);
    if (!book) notFound();
  }
  return book;
};

export const getCachedBooks = async (bookIds: string[]) => {
  if (bookIds.length === 0) return [];
  const redisPipe = redis.pipeline();
  bookIds.forEach((bookId) => {
    redisPipe.hgetall(`book:${bookId}:meta`);
  });
  const books: any[] = await redisPipe.exec();
  const bookDatas: BookMetaData[] = await Promise.all(
    books.map(async (book, index) => {
      let b: BookMetaData = book;
      if (!b) {
        console.log("Book not found in cache");
        b = await setBook(bookIds[index]);
        if (!b) notFound();
      }
      return {
        id: b.id,
        title: b.title,
        description: b.description,
        topic: b.topic,
        userId: b.userId,
        followers: b.followers,
        coverImage: b.coverImage,
        darkText: b.darkText,
      };
    })
  );
  return bookDatas;
};
