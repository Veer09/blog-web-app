import { Topic } from "@prisma/client";
import { z } from "zod";
export const TopicFollowSchema = z.string();

export type cachedTopic = {
  name: string;
  blogs: string;
  followers: string;
};

