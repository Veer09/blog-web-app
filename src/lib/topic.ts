import { cachedBlog } from "@/type/blog";
import { redis } from "./redis";
import prisma from "./db";
import { setBlog } from "./user";

export const getBlogByTopic = async (topic: string) => {
  const blogs = await redis.lrange(`topic:${topic}:blogs`, 0, -1);
  if (blogs.length === 0) return [];
  const redisPipe = redis.pipeline();
  blogs.forEach((blog) => {
    redisPipe.hgetall(`blog:${blog}`);
  });
  const blogData: any = await redisPipe.exec();
  const blogDatas = await Promise.all(blogData.map(
    async (blog: cachedBlog | null, index: number) => {
      if (!blog) {
        const blog = await setBlog(blogs[index]);
        if (!blog) await redis.lrem(`topic:${topic}:blogs`, 0, blogs[index]);
        else return blog;
      }
      return blog;
    }
  ));
  return blogDatas.filter(blog => blog !== undefined) as cachedBlog[];
};

export const setBlogsByTopic = async (topic: string) => {
  const blogs = await prisma.blog.findMany({
    where: {
      topics: {
        some: {
          name: topic,
        },
      },
    },
    select: {
      id: true,
    },
  });
  if (blogs.length === 0) return [];
  await redis.lpush(`topic:${topic}:blogs`, ...blogs.map((blog) => blog.id));
  const redisPipe = redis.pipeline();
  blogs.forEach((blog) => {
    redisPipe.hgetall(`blog:${blog.id}`);
  });
  const blogData: any = await redisPipe.exec();
  return blogData as cachedBlog[];
};

export const getBooksByTopic = async (topic: string) => {
  const books = await prisma.book.findMany({
    where: {
      topic_name: topic,
    },
    select: {
      id: true,
      title: true,
      description: true,
    }
  })
  return books;
}