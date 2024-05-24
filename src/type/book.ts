import { z } from "zod";

export const chapterSchema = z.object({
  name: z.string(),
  link: z.optional(z.object({ id: z.string(), type: z.enum(["chapter", "book"]), user_id: z.string() })),
  blogs: z.array(z.object({ id: z.string(), name: z.string() })),
});


export type Chapter = z.infer<typeof chapterSchema> & {
  children: Chapter[];
};

export const chapterListSchema = z.array(z.custom<Chapter>())

export const bookSchema = z.object({
  name: z.string(),
  description: z.string(),
  topic: z.string(),
  chapters:z.array(z.custom<Chapter>()) 
});

export type Book = z.infer<typeof bookSchema>;