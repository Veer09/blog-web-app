import { z } from "zod";

export const savedBySchema = z.string();

export const UserFollowSchema = z.string();

export type cachedUser = {
  id: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  blogs: string;
  followers: string;
}