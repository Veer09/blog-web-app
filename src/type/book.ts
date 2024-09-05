import { z } from "zod";

export const chapterSchema = z.object({
  //If Chapter is Linked 
  link: z.optional(
    z.object({
      id: z.string(),
      type: z.enum(["chapter", "book", "create"]),
      user_id: z.string(),
    })
  ),
  //If Chapter is created
  create: z.optional(
    z.object({
      blogs: z.array(z.object({ id: z.string(), title: z.string() })),
    })
  ),
  title: z.string(),
  chapterNumber: z.number(),
  number: z.optional(z.number()),
});

export type Chapter = z.infer<typeof chapterSchema>;
export type cachedBook = Omit<Chapter, "number">

export const chapterListSchema = z.array(z.custom<Chapter>());


export type BookMetaData = {
  id: string
  title: string;
  description: string;
  topic: string;
  userId: string;
  followers: number;
  coverImage?: string;
  darkText?: boolean;
};

export const bookSchema = z.object({
  name: z.string(),
  description: z.string(),
  topic: z.string(),
  chapters: z.array(z.custom<Chapter>()),
});

export type Book = z.infer<typeof bookSchema>;

export const serverForm = z.object({
  name: z.string(),
  description: z.string(),
  topic: z.string(),
  url: z.optional(z.string()),
  darkText: z.boolean()
})

export const updateSchema = z.object({
  number: z.number(),
  customChapter: z.optional(z.custom<Chapter>()) ,
  updateChapter: z.optional(z.object({
    newId: z.string(),
    oldId: z.string(),
    type: z.enum(["chapter", "book"]),
  })),
  updateBlog: z.optional(z.object({
    chapter: z.string(),
    ids: z.array(z.object({
      newId: z.string(),
      oldId: z.string(),
    }))
  })),
  addBlog: z.optional(z.object({
    chapter: z.string(),
    id: z.array(z.string()),
  })),
  updateChapterNumber: z.optional(z.object({
    chapterNumber: z.number(),
    id: z.string(),
    type: z.enum(["chapter", "book"]),
  })),
  removeChapter: z.optional(z.object({
    id: z.string(),
    chapterNumber: z.number(),
    type: z.enum(["chapter", "book"]),
  })),
  removeBlog: z.optional(z.object({
    id: z.array(z.string()),
    chapter: z.string(),
  })),

})

export type UpdateDetails = z.infer<typeof updateSchema>;

export const updateBookSchema = z.object({
  content: z.array(z.custom<Chapter>()),
  updateDetails: z.array(z.custom<UpdateDetails>()),
})

