import { auth, clerkClient, useUser } from "@clerk/nextjs";
import { redis } from "./redis";
import { cachedBlog } from "@/type/blog";
import { cachedUser } from "@/type/user";
import { cachedTopic } from "@/type/topic";
import prisma from "./db";

export const getUserFollowings = async (count: number | undefined) => {
  const { userId } = auth();
  if (!userId) return [];
  const followings = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      following: true,
    },
  });

  if (!followings) return [];
  if (!count) count = followings.following.length;
  if (count > followings.following.length) count = followings.following.length;
  const redisPipe = redis.pipeline();
  followings.following.forEach((following) => {
    redisPipe.hgetall(`user:${following}`);
  });
  const followingData = await redisPipe.exec();
  const followingDatas = await Promise.all(
    followingData.map(async (user, index) => {
      if (!user) {
        const user = await setUser(followings.following[index].id);
        return user;
      }
      return user;
    })
  );
  return followingDatas as cachedUser[];
};

export const getUnfollowedUsers = async (count: number | undefined) => {
  const { userId } = auth();
  if (!userId) return [];
  const followings = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      following: true,
    },
  });
  let ids: string[] = [];
  if (!followings) ids = [];
  else ids = followings.following.map((user) => user.id);
  ids.push(userId);
  const unfollowed = await prisma.user.findMany({
    where: {
      NOT: {
        id: {
          in: ids,
        },
      },
    },
    select: {
      id: true,
    },
  });
  if (unfollowed.length === 0) return [];
  const redisPipe = redis.pipeline();
  if (!count) count = unfollowed.length;
  if (count > unfollowed.length) count = unfollowed.length;
  for (let i = 0; i < count; i++) {
    redisPipe.hgetall(`user:${unfollowed[i].id}`);
  }
  const unfollowedUsers = await redisPipe.exec();
  const unfollowedUserDatas = await Promise.all(
    unfollowedUsers.map(async (user, index) => {
      if (!user) {
        const user = await setUser(unfollowed[index].id);
        return user;
      }
      return user;
    })
  );
  return unfollowedUserDatas as cachedUser[];
};

export const getUserTopics = async (count: number | undefined) => {
  const { userId } = auth();
  if (!userId) return [];
  const topics = await prisma.user
    .findUnique({
      where: {
        id: userId,
      },
      select: {
        topics: true,
      },
    })
    .then((data) => data?.topics);

  if (!topics) return [];
  if (!count) count = topics.length;
  if (count > topics.length) count = topics.length;
  const redisPipe = redis.pipeline();
  if (!count) count = topics.length;
  if (count > topics.length) count = topics.length;

  for (let i = 0; i < count; i++) {
    redisPipe.hgetall(`topic:${topics[i].name}`);
  }
  const topicData: any = await redisPipe.exec();
  const topicDatas = await Promise.all(
    topicData.map(async (topic: cachedTopic | null, index: number) => {
      if (!topic) {
        const topic = await setTopic(topics[index].name);
        return topic;
      }
      return topic;
    })
  );
  return topicDatas as cachedTopic[];
};

export const getUnfollowedTopics = async (count: number | undefined) => {
  const { userId } = auth();
  if (!userId) return [];
  const following = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      topics: true,
    },
  });
  let ids: string[] = [];
  if (!following) ids = [];
  else ids = following.topics.map((topic) => topic.name);
  const unfollowed = await prisma.topic.findMany({
    where: {
      NOT: {
        name: {
          in: ids,
        },
      },
    },
  });
  if (unfollowed.length === 0) return [];
  const redisPipe = redis.pipeline();
  if (!count) count = unfollowed.length;
  if (count > unfollowed.length) count = unfollowed.length;
  for (let i = 0; i < count; i++) {
    redisPipe.hgetall(`topic:${unfollowed[i]}`);
  }
  const unfollowedTopics = await redisPipe.exec();
  const unfollowedTopicDatas = await Promise.all(
    unfollowedTopics.map(async (topic, index) => {
      if (!topic) {
        const topic = await setTopic(unfollowed[index].name);
        return topic;
      }
      return topic;
    })
  );
  return unfollowedTopicDatas as cachedTopic[];
};

export const getUserBlogs = async () => {
  const { userId } = auth();
  if (!userId) return null;
  const blogs: string[] | null = await redis.lrange(
    `user:${userId}:blogs`,
    0,
    -1
  );
  if (blogs.length === 0){
    const blogData = await setUserBlogs();
    return blogData;
  };
  const redisPipe = redis.pipeline();
  blogs.forEach((blog) => {
    redisPipe.hgetall(`blog:${blog}`);
  });
  const blogData: any = await redisPipe.exec();
  const blogDatas = await Promise.all(blogData.map(async (blog: cachedBlog | null, index : number) => {
    if(!blog){
      const blog = await setBlog(blogs[index]);
      if(!blog) await redis.lrem(`user:${userId}:blogs`, 0, blogs[index]);
      else return blog;
    }
    return blog;
  }))
  return blogDatas as cachedBlog[];
};

export const getSavedBlog = async () => {
  const { userId } = auth();
  if (!userId) return null;
  const blogs = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      saved_blog: {
        select: {
          id: true,
        },
      },
    },
  });
  if (!blogs) return null;
  const redisPipe = redis.pipeline();
  blogs.saved_blog.forEach((blog) => {
    redisPipe.hgetall(`blog:${blog}`);
  });
  const blogData: any = await redisPipe.exec();
  const blogDatas = await Promise.all(
    blogData.map(async (blog: cachedBlog | null, index: number) => {
      if (!blog) {
        const blog = await setBlog(blogs.saved_blog[index].id);
        return blog;
      }
      return blog;
    })
  );
  return blogDatas as cachedBlog[];
};

export const isBlogLiked = async (blogId: string) => {
  const { userId } = auth();
  if (!userId) return false;
  const liked = await prisma.like.findFirst({
    where: {
      blog_id: blogId,
      user_id: userId,
    },
  });
  return liked ? true : false;
};

export const isBlogSaved = async (blogId: string) => {
  const { userId } = auth();
  if (!userId) return false;
  const saved = await prisma.user.findFirst({
    where: {
      id: userId,
      saved_blog: {
        some: {
          id: blogId,
        },
      },
    },
  });
  return saved ? true : false;
};

export const getFeedBlogs = async (index: number) => {
  const count = 5;
  const { userId } = auth();
  if (!userId) return [];

  const feed: string[] = await redis.zrange(
    `user:${userId}:feed`,
    (index - 1) * count,
    index * count - 1
  );

  if (feed.length === 0) return [];
  const redisPipe = redis.pipeline();
  feed.forEach((blog) => {
    redisPipe.hgetall(`blog:${blog}`);
  });
  const blogData = await redisPipe.exec();
  return blogData as cachedBlog[];
};

//Change
export const getCreatedBooks = async () => {
  const { userId } = auth();
  if (!userId) return null;

  const books = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      createdBooks: {
        select: {
          id: true,
          title: true,
          description: true,
          topic_name: true,
        },
      },
    },
  });
  if (!books) return null;
  return books.createdBooks;
};

export const setUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      _count: {
        select: {
          blogs: true,
          followers: true,
        },
      },
    },
  });
  if (!user) return null;
  const { blogs, followers } = user._count;
  const userDeatils = await clerkClient.users.getUser(userId);
  if (!userDeatils) return null;
  const { firstName, lastName, imageUrl } = userDeatils;
  const userData = {
    id: userId,
    firstName,
    lastName,
    imageUrl,
    blogs,
    followers,
  };
  await redis.hmset(`user:${userId}`, userData);
  return userData;
};

export const setBlog = async (blogId: string) => {
  const blog = await prisma.blog.findUnique({
    where: {
      id: blogId,
    },
    select: {
      _count: {
        select: {
          like: true,
        },
      },
      coverImage: true,
      createdAt: true,
      description: true,
      title: true,
      user_id: true,
    },
  });
  if (!blog) return null;
  const { like } = blog._count;
  const { coverImage, createdAt, description, title, user_id } = blog;
  const blogData = {
    id: blogId,
    title,
    description,
    coverImage,
    createdAt,
    likes: like,
    user_id,
  };
  await redis.hmset(`blog:${blogId}`, blogData);
  return blogData;
};

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

export const setUserBlogs = async () => {
  const { userId } = auth();
  if (!userId) return null;
  const blogs = await prisma.blog.findMany({
    where: {
      user_id: userId,
    },
    select: {
      id: true,
    },
  });
  if (blogs.length == 0) return null;
  const blogIds = blogs.map((blog) => blog.id);
  await redis.lset(`user:${userId}:blogs`, 0, blogIds);
  const redisPipe = redis.pipeline();
  blogIds.forEach((id) => {
    redisPipe.hgetall(`blog:${id}`);
  });
  const blogData: any = await redisPipe.exec();
  return blogData as cachedBlog[];
};
