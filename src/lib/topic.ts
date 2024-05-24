import { cachedBlog } from "@/type/blog";
import { redis } from "./redis"
import prisma from "./db";


export const getBlogByTopic = async (topic: string) => {
  const blogs = await redis.lrange(`topic:${topic}`, 0, -1);
  if (blogs.length === 0) return null;
  const redisPipe = redis.pipeline();
  blogs.forEach((blog) => {
    redisPipe.hgetall(`blog:${blog}`);
  });
  const blogData: any = await redisPipe.exec();
  return blogData as cachedBlog[];
}

export const setBlogsByTopic = async (topic: string) => {
  const blogs =await prisma.blog.findMany({
    where: {
      topics: {
        some: {
          name: topic
        }
      }
    },
    select: {
      id: true
    }
  })
  if(blogs.length === 0) return [];
  await redis.lset(`topic:${topic}`, 0, blogs.map(blog => blog.id));
  const redisPipe = redis.pipeline();
  blogs.forEach((blog) => {
    redisPipe.hgetall(`blog:${blog.id}`);
  });
  const blogData: any = await redisPipe.exec();
  return blogData as cachedBlog[];
}