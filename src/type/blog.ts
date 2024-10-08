import { OutputData } from "@editorjs/editorjs";
import { Blog } from "@prisma/client";
import { z } from "zod";



export const blogUploadSchema = z.object({
    content: z.custom<OutputData>().optional(),
    title: z.string().max(100).min(3).optional(),
    description: z.string().max(1000).min(5).optional(),
    coverImage: z.string().min(0).optional(),
    topics: z.array(z.string()).optional()
});


export const blogFormSchema = z.object({
    title: z.string(),
    description: z.string(),
    coverImage: z.string().optional(),
    topics: z.array(z.string()),
    content: z.custom<OutputData | undefined>(),
  })
  
  export type BlogForm = z.infer<typeof blogFormSchema>;

export const blogDraftSchema = z.object({
    name: z.string(),
    content: z.custom<OutputData>()
})

export const saveDraftSchema = z.object({
    content: z.custom<OutputData>()
})

export const blogPublishSchema = z.object({
    topics: z.array(z.string()),
    blogData: z.custom<Blog>()
})


export type cachedBlog = {
    id: string;
    title: string;
    description: string;
    coverImage: string | null;
    createdAt: string | Date;
    likes: number;
    authorId: string;
    authorName: string;
    authorImage: string;
    topics: string[];
}

export type onlyBlog = {
    id: string;
    title: string;
    description: string;
    coverImage: string | null;
    createdAt: string | Date;
    likes: number;
    authorId: string;
    topics: string[];
}