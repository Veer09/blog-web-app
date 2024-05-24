import { User } from "@clerk/nextjs/server";
import { Comment } from "@prisma/client";
import { z } from "zod";

export const commentUploadSchema = z.object({
  comment: z.string(),
  blogId: z.string(),
});

export const commentGetSchema = z.string();

export const commentDeleteSchema = z.object({
  comment: z.string(),
  userId: z.string(),
  blogId: z.string(),
});

export const replayCommentSchema = z.object({
  comment: z.string(),
  commentId: z.string(),
  blogId: z.string(),
});

export const commentGetResponseSchema = z.array(
  z.object({
    comment: z.custom<Comment & { _count: { replies: number } }>(),
    user: z.custom<User>(),
  })
);

export interface PastComments {
  comment: Comment & { _count: { replies: number } };
  user: User;
}

export interface CommentData {
  id: string;
  content: string;
  user_id: string;
  reply_id: string | null;
  blog_id: string;
  user: {
    firstName: string;
    lastName: string;
    imageUrl: string;
  };
}
