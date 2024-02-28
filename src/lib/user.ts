import { auth } from "@clerk/nextjs";
import { redis } from "./redis";
import { cachedBlog } from "@/type/blog";
import { cachedUser } from "@/type/user";
import { cachedTopic } from "@/type/topic";

export const getUserFollowings = async (
  count: number | undefined
) => {
  const { userId } = auth();
  if (!userId) return [];
  const users = await redis.smembers(`user:${userId}:following`);
  if (users.length === 0) return [];
  const redisPipe = redis.pipeline();
  if(!count) count = users.length;  
  if(count > users.length) count = users.length;
  for(let i = 0; i < count; i++) {
    redisPipe.hgetall(`user:${users[i]}`);
  }
  const following = await redisPipe.exec(); 
  return following as cachedUser[]; 
};

export const getUnfollowedUsers = async (
  count: number | undefined
) => {
  const { userId } = auth();
  if (!userId) return [];
  const unfollowed = await redis.sdiff(`users`, `user:${userId}:following`);
  if (unfollowed.length === 0) return [];
  const redisPipe = redis.pipeline();
  if(!count) count = unfollowed.length;  
  if(count > unfollowed.length) count = unfollowed.length;
  for(let i = 0; i < count; i++) {
    if(unfollowed[i] === userId) {
      continue
    };
    redisPipe.hgetall(`user:${unfollowed[i]}`);
  }
  if(redisPipe.length() === 0) return [];
  const unfollowedUsers = await redisPipe.exec();
  return unfollowedUsers as cachedUser[];
};

export const getUserTopics = async (count: number | undefined) => {
  const { userId } = auth();
  if (!userId) return [];
  const topics = await redis.smembers(`user:${userId}:topics`);
  if (topics.length === 0) return [];
  const redisPipe = redis.pipeline();
  if(!count) count = topics.length;  
  if(count > topics.length) count = topics.length;
  for(let i = 0; i < count; i++) {
    redisPipe.hgetall(`topic:${topics[i]}`);
  }
  const topicData: any = await redisPipe.exec();
  return topicData as cachedTopic[];
}

export const getUnfollowedTopics = async (count: number | undefined) => {
  const { userId } = auth();
  if (!userId) return [];
  const unfollowed = await redis.sdiff(`topics`, `user:${userId}:topics`);
  if (unfollowed.length === 0) return [];
  const redisPipe = redis.pipeline();
  if(!count) count = unfollowed.length;  
  if(count > unfollowed.length) count = unfollowed.length;
  for(let i = 0; i < count; i++) {
    redisPipe.hgetall(`topic:${unfollowed[i]}`);
  }
  const unfollowedTopics = await redisPipe.exec();
  return unfollowedTopics as cachedTopic[];
}

export const getUserBlogs = async () => {
  const { userId } = auth();
  if (!userId) return null;
  const blogs: string[] | null = await redis.lrange(`user:${userId}:blogs`, 0, -1);
  if(blogs.length === 0) return null;
  const redisPipe = redis.pipeline();
  blogs.forEach((blog) => {
    redisPipe.hgetall(`blog:${blog}`);
  });
  const blogData: any = await redisPipe.exec();
  return blogData as cachedBlog[];
};

export const getSavedBlog = async () => {
  const { userId } = auth();
  if (!userId) return null;
  const blogs = await redis.smembers(`user:${userId}:saved`);
  if (blogs.length === 0) return null;
  const redisPipe = redis.pipeline();
  blogs.forEach((blog) => {
    redisPipe.hgetall(`blog:${blog}`);
  });
  const blogData: any = await redisPipe.exec();
  return blogData as cachedBlog[];
};

export const getFeedBlogs = async (count: number, index: number) => {
  const { userId } = auth();
  if (!userId) return;
  const feed: string[] = await redis.zrange(`user:${userId}:feed`, index, index + count -1, {
    rev: true,
  });
  if (feed.length === 0) return [];
  const redisPipe = redis.pipeline();
  feed.forEach((blog) => {
    redisPipe.hgetall(`blog:${blog}`);
    redisPipe.zadd(`user:${userId}:feed`, {
      score: Date.now(),
      member: blog,
    });
  })
  const blogData = await redisPipe.exec();
  console.log(blogData);
  return blogData.filter((blog: any, index) => !(index%2)) as cachedBlog[];
};


