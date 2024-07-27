import { OutputData } from "@editorjs/editorjs";
import { Blog } from "@prisma/client";
import { z } from "zod";



export const blogUploadSchema = z.object({
    content: z.custom<OutputData>(),
    title: z.string().max(100).min(3),
    description: z.string().max(1000).min(5),
    image: z.string().min(0),
    topics: z.array(z.string())
});

export const blogDraftSchema = z.object({
    name: z.string(),
    content: z.custom<OutputData>()
})

export const saveDraftSchema = z.object({
    content: z.custom<OutputData>()
})

export const blogPublishSchema = z.object({
    userId: z.string(),
    topics: z.array(z.object({
        name: z.string()
    })),
    blogData: z.custom<Blog>()
})

export const blogSchema = z.string()

export type cachedBlog = {
    id: string;
    title: string;
    description: string;
    coverImage: string;
    createdAt: string | Date;
    likes: number;
    autherId: string;
    autherName: string;
    topics: string[];
}
