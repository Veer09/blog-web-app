import { z } from "zod";

export const savedBySchema = z.string();

export const UserFollowSchema = z.string();
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