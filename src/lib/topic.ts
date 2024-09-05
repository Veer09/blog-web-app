import { onlyBlog } from "@/type/blog";
import { cachedTopic } from "@/type/topic";
import { notFound } from "next/navigation";
import { getCachedBlogs } from "./blog";
import { getCachedBooks } from "./book";
import prisma from "./db";
import { redis } from "./redis";

export const getBlogByTopic = async (topic: string) => {
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
  })
  return await getCachedBlogs(blogs.map((blog) => blog.id));
};

export const getBooksByTopic = async (topic: string) => {
  const books = await prisma.book.findMany({
    where: {
      topic_name: topic,
    },
    select: {
      id: true,
    }
  })
  return getCachedBooks(books.map((book) => book.id));
}

const setTopic = async (topicName: string) => {
  const topic = await prisma.topic.findUnique({
    where: {
      name: topicName,
    },
    select: {
      _count: {
        select: {
          users: true,
          blogs: true,
        },
      },
    },
  });
  if (!topic) return null;
  const { users, blogs } = topic._count;

  const topicData = {
    name: topicName,
    blogs,
    followers: users,
  };
  await redis.hmset(`topic:${topicName}`, topicData);
  return topicData;
};

export const getCachedTopic = async (topicId: string) => {
  let topic: cachedTopic | null = await redis.hgetall(`topic:${topicId}`);
  if (!topic) {
    topic = await setTopic(topicId);
    if (!topic) return notFound();
  }
  return topic;
};

export const getCachedTopics = async (topicIds: string[]) => {
  if (topicIds.length === 0) return [];
  const redisPipe = redis.pipeline();
  topicIds.forEach((topicId) => {
    redisPipe.hgetall(`topic:${topicId}`);
  });
  const topics: any[] = await redisPipe.exec();
  const topicDatas: cachedTopic[] = await Promise.all(
    topics.map(async (topic, index) => {
      let t = topic;
      if (!t) {
        t = await setTopic(topicIds[index]);
        if (!t) notFound();
      }
      return {
        name: t.name,
        blogs: parseInt(t.blogs),
        followers: parseInt(t.followers),
      };
    })
  );
  return topicDatas as cachedTopic[];
};