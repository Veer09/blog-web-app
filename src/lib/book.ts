import prisma from "./db";

export type ChapterType = {
  title: string;
  chapters: ChapterType[];
  description? : string;
  blogs: { title: string; id: string }[];
};
export const getBook = async (bookId: string) => {
  const book = await prisma.book.findFirst({
    where: {
      id: bookId,
    },
    select: {
      title: true,
      description: true,
      chapters: {
        select: {
          chapter_id: true,
          chapter_number: true,
        },
        orderBy: {
          chapter_number: "asc",
        },
      },
      books: {
        select: {
          child_id: true,
          child_number: true,
        },
        orderBy: {
          child_number: "asc",
        },
      },
    },
  });

  if (!book) return null;
  const result: ChapterType = {
    title: book.title,
    description: book.description,
    blogs: [],
    chapters: [],
  };
  let n = book.chapters.length,
    m = book.books.length;
  while (n > 0 && m > 0) {
    if (book.chapters[0].chapter_number < book.books[0].child_number) {
      const subChapter = await getChapter(book.chapters[0].chapter_id);
      if (!subChapter) {
        n--;
        continue;
      }
      result.chapters.push(subChapter);
      n--;
    } else {
      const subBook = await getBook(book.books[0].child_id);
      if (!subBook) {
        m--;
        continue;
      }
      result.chapters.push(subBook);
      m--;
    }
  }

  if (n > 0) {
    for (let i = 0; i < n; i++) {
      const subChapter = await getChapter(book.chapters[i].chapter_id);
      if (!subChapter) continue;
      result.chapters.push(subChapter);
    }
  }

  if (m > 0) {
    for (let i = 0; i < m; i++) {
      const subBook = await getBook(book.books[i].child_id);
      if (!subBook) continue;
      result.chapters.push(subBook);
    }
  }

  return result;
};

export const getChapter = async (chapterId: string) => {
  const chapter = await prisma.chapter.findFirst({
    where: {
      id: chapterId,
    },
    select: {
      title: true,
      blogs: {
        select: {
          title: true,
          id: true,
        },
      },
      chapter: {
        select: {
          subchapter_id: true,
          subchapter_number: true,
        },
        orderBy: {
          subchapter_number: "asc",
        },
      },
      subBook: {
        select: {
          book_id: true,
          book_number: true,
        },
        orderBy: {
          book_number: "asc",
        },
      },
    },
  });
  if (!chapter) return null;
  const result: ChapterType = {
    title: chapter.title,
    blogs: chapter.blogs,
    chapters: [],
  };
  let n = chapter.chapter.length,
    m = chapter.subBook.length;
  while (n > 0 && m > 0) {
    if (chapter.chapter[0].subchapter_number < chapter.subBook[0].book_number) {
      const subChapter = await getChapter(chapter.chapter[0].subchapter_id);
      if (!subChapter) {
        n--;
        continue;
      }
      result.chapters.push(subChapter);
      n--;
    } else {
      const subBook = await getBook(chapter.subBook[0].book_id);
      if (!subBook) {
        m--;
        continue;
      }
      result.chapters.push(subBook);
      m--;
    }
  }
  if (n > 0) {
    for (let i = 0; i < n; i++) {
      const subChapter = await getChapter(chapter.chapter[i].subchapter_id);
      if (!subChapter) continue;
      result.chapters.push(subChapter);
    }
  }
  if (m > 0) {
    for (let i = 0; i < m; i++) {
      const subBook = await getBook(chapter.subBook[i].book_id);
      if (!subBook) continue;
      result.chapters.push(subBook);
    }
  }
  return result;
};
