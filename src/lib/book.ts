import { BookMetaData, Chapter } from "@/type/book";
import { auth } from "@clerk/nextjs";
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

