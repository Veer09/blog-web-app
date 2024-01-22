
import { User } from "@clerk/nextjs/server";
import { Comment } from "@prisma/client";
import { comment } from "postcss";
import { z } from "zod";

export const commentUploadSchema = z.object({
    comment: z.string(),
    blogId: z.string()
})

export const commentGetSchema = z.string();

export const commentDeleteSchema = z.object({
    comment: z.string(),
    userId: z.string(),
});

export const replayCommentSchema = z.object({
    comment: z.string(),
    commentId: z.string(),
    blogId: z.string(),
});

export const commentGetResponseSchema = z.array(z.object({
    comment: z.custom<Comment & {_count: { replies: number}}>(),
    user: z.custom<User>(),
}))

export const repliesGetSchema = z.string();

export interface PastComments {
    comment: Comment & {_count: { replies: number}},
    user: User,

}
