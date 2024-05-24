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
  return followingData as cachedUser[];
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
  else ids = followings?.following.map((following) => following.id);
  const unfollowed = await redis.sdiff("users", ...ids);
  if (unfollowed.length === 0) return [];
  const redisPipe = redis.pipeline();
  if (!count) count = unfollowed.length;
  if (count > unfollowed.length) count = unfollowed.length;
  for (let i = 0; i < count; i++) {
    redisPipe.hgetall(`user:${unfollowed[i]}`);
  }
  const unfollowedData = await redisPipe.exec();
  return unfollowedData as cachedUser[];
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
  return topicData as cachedTopic[];
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
  const unfollowed = await redis.sdiff("topics", ...ids);
  if (unfollowed.length === 0) return [];
  const redisPipe = redis.pipeline();
  if (!count) count = unfollowed.length;
  if (count > unfollowed.length) count = unfollowed.length;
  for (let i = 0; i < count; i++) {
    redisPipe.hgetall(`topic:${unfollowed[i]}`);
  }
  const unfollowedTopics = await redisPipe.exec();
  return unfollowedTopics as cachedTopic[];
};

export const getUserBlogs = async () => {
  const { userId } = auth();
  if (!userId) return null;
  const blogs: string[] | null = await redis.lrange(
    `user:${userId}:blogs`,
    0,
    -1
  );
  if (blogs.length === 0) return null;
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
  return blogData as cachedBlog[];
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
      id: userId
    },
    select: {
      _count: {
        select: {
          blogs: true,
          followers: true
        }
      }
    }
  })
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
    followers
  }
  await redis.hmset(`user:${userId}`, userData);
  return userData;
}

export const setBlog = async (blogId: string) => {
  const blog = await prisma.blog.findUnique({
    where: {
      id: blogId
    },
    select: {
      _count: {
        select: {
          like: true
        }
      },
      coverImage: true,
      createdAt: true,
      description: true,
      title: true,
      user_id: true
    }
  })
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
    user_id
  }
  await redis.hmset(`blog:${blogId}`, blogData);
  return blogData;
}

const setTopic = async (topicName: string) => {
  const topic = await prisma.topic.findUnique({
    where: {
      name: topicName
    },
    select: {
      _count: {
        select: {
          users: true,
          blogs: true
        }
      },
    }
  })
  if (!topic) return null;
  const { users, blogs } = topic._count;

  const topicData = {
    name: topicName,
    blogs,
    followers: users
  }
  await redis.hmset(`topic:${topicName}`, topicData);
  return topicData;
}

const setUserBlogs = async (userId: string) => {
  const blogs = await prisma.blog.findMany({
    where: {
      user_id: userId
    },
    select: {
      id: true
    }
  })
  if (!blogs) return null;
  const blogIds = blogs.map(blog => blog.id);
  await redis.lset(`user:${userId}:blogs`, 0, blogIds);
}
