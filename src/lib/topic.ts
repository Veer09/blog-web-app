import { unstable_cache } from "next/cache"
import prisma from "./db"
export const getBlogByTopic = async (topic: string) => {
  return prisma.blog.findMany({
    where: {
      topics: {
        some: {
          name: topic
        }
      }
    },
    select: {
      id: true,
      title: true,
      description: true,
      coverImage: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

