import { z } from "zod";

export const savedBySchema = z.string();

export const UserFollowSchema = z.string().length(25);
export type UserDetails = {
    id: string;
    _count: {
      blogs: number;
      // saved_blog: number;
      // reading_history: number;
      // topics: number;
      followers: number;
      // following: number;
      // comments: number;
    };
  }