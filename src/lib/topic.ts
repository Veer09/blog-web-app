import { Topic, User } from "@prisma/client";
import prisma from "./db";

export interface TopicWithCount {
  id: string;
  name: string;
  _count: {
    users: number;
    blogs: number;
  };
  users: {
    user_id: string
  }[];
}

export const getAllTopic = async (
  count: number | null
): Promise<TopicWithCount[]> => {
  if (!count) {
    const topics = await prisma.topic.findMany({
      orderBy: {
        users: {
          _count: 'desc'
        }
      },
      select: {
        users: {
          select: {
            user_id: true
          }
        },
        name: true,
        id: true,
        _count: true
      }
    });

    return topics;
  }
  const topics = await prisma.topic.findMany({
    orderBy: {
      users: {
        _count: 'desc'
      }
    },
    select: {
      users: {
        select: {
          user_id: true
        }
      },
      name: true,
      id: true,
      _count: true
    },
    take: count
  });

  return topics;
};
