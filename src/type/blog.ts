import { OutputData } from "@editorjs/editorjs";
import { z } from "zod";



export const blogUploadSchema = z.object({
    content: z.custom<OutputData>(),
    title: z.string().max(100).min(3),
    description: z.string().max(1000).min(5),
    image: z.string().min(0),
    topics: z.array(z.string())
});




export const blogSchema = z.string()

export type cachedBlog = {
    id: string;
    title: string;
    description: string;
    coverImage: string;
    createdAt: string | Date;
}
