import { Topic, User } from "@prisma/client";
import prisma from "./db";
import { TopicDetails } from "@/type/topic";


export const getAllTopic = async (
  count: number | null
): Promise<TopicDetails[]> => {
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
            id: true
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
          id: true
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
