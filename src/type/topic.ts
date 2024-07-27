import { z } from "zod";
export const TopicFollowSchema = z.string();

export type cachedTopic = {
  name: string;
  blogs: number;
  followers: number;
};

