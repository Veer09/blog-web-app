import { z } from "zod";

export const savedBySchema = z.string();

export const UserFollowSchema = z.string();

export type cachedUser = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
  blogs: number;
  followers: number;
}

export const UserFollowAddSchema = z.object({
  userId: z.string(),
  followerId: z.string()
})