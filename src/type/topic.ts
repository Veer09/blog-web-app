import { Topic } from "@prisma/client";
import { z } from "zod";
export const TopicFollowSchema = z.string().length(25);

export type TopicDetails = {
    id: string;
    name: string;
    _count: {
      users: number;
      blogs: number;
    };
    users: {
      id: string
    }[];
}



