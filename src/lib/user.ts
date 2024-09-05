import { cachedUser } from "@/type/user";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { getCachedBlogs } from "./blog";
import { getCachedBooks } from "./book";
import prisma from "./db";
import { redis } from "./redis";
import { getCachedTopics } from "./topic";

export const getUserFollowings = async (userId: string, index: number) => {
  const count = 7;
  const followings = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      following: {
        take: count,
        skip: (index - 1) * count,
      },
    },
  });
  if (!followings) return [];
  const ids = followings.following.map((following) => following.id);
  return await getCachedUsers(ids);
};

export const getUnfollowedUsers = async (userId: string, index: number) => {
  const count = 7;
  const followings = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      following: true,
    },
  });
  if (!followings) return [];
  let ids: string[] = [];
  ids = followings.following.map((user) => user.id);
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
    skip: (index - 1) * count,
    take: count,
  });
  return await getCachedUsers(unfollowed.map((user) => user.id));
};

export const getUserTopics = async (userId: string, index: number) => {
  const count = 7;
  const topics = await prisma.user
    .findUnique({
      where: {
        id: userId,
      },
      select: {
        topics: {
          take: count,
          skip: (index - 1) * count,
        },
      },
    })
    .then((data) => data?.topics);
  if (!topics) return [];
  return await getCachedTopics(topics.map((topic) => topic.name));
};

export const getUnfollowedTopics = async (userId: string, index: number) => {
  let count = 7;
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
    skip: (index - 1) * count,
    take: count,
  });
  return await getCachedTopics(unfollowed.map((topic) => topic.name));
};

export const getUserBlogs = async (userId: string) => {
  const blogs: string[] = await redis.lrange(`user:${userId}:blogs`, 0, -1);
  if (blogs.length === 0) {
    const blogData = await setUserBlogs(userId);
    return blogData;
  }
  return await getCachedBlogs(blogs);
};

export const getSavedBlog = async (userId: string) => {
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
  if (!blogs) return [];
  return await getCachedBlogs(blogs.saved_blog.map((blog) => blog.id));
};

export const getDraftBlogs = async (userId: string) => {
  const drafts = await prisma.draft.findMany({
    where: {
      user_id: userId,
    },
  });
  return drafts;
};

export const getDraftById = async (draftId: string, userId: string) => {
  const draft = await prisma.draft.findUnique({
    where: {
      id: draftId,
      user_id: userId,
    },
  });
  if (!draft) notFound();
  return draft;
};

export const isUserFollowed = async (checkUserId: string) => {
  const { userId } = auth();
  if (!userId) return false;

  const followed = await prisma.user.findFirst({
    where: {
      id: userId,
      followers: {
        some: {
          id: checkUserId,
        },
      },
    },
  });
  return followed ? true : false;
}

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

export const getUserReadingHistory = async (userId: string) => {
  const blogs = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      reading_history: true,
    },
  });

  if (!blogs) return [];
  return await getCachedBlogs(blogs.reading_history.map((blog) => blog.id));
};

export const getCreatedBooks = async (userId: string) => {
  const books = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      createdBooks: {
        select: {
          id: true,
        },
      },
    },
  });
  if (!books) return [];
  return await getCachedBooks(books.createdBooks.map((book) => book.id));
};

export const getFeedBlogs = async (userId: string, index: number) => {
  const count = 5;

  const feed: string[] = await redis.zrange(
    `user:${userId}:feed`,
    (index - 1) * count,
    index * count - 1
  );

  return await getCachedBlogs(feed);
};

export const getUserFollowedBooks = async (userId: string) => {
  const books = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      followingBooks: {
        select: {
          id: true,
        },
      },
    },
  });
  if (!books) return [];
  const bookIds = books.followingBooks.map((book) => book.id);
  const book = await getCachedBooks(bookIds);
  return book;
};

export const setBlogRead = async (blogId: string, userId: string | null) => {
  if (!userId) return;
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      reading_history: {
        connect: {
          id: blogId,
        },
      },
    },
  });
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

export const setUserBlogs = async (userId: string) => {
  const blogs = await prisma.blog.findMany({
    where: {
      user_id: userId,
    },
    select: {
      id: true,
    },
  });
  if (blogs.length == 0) return [];
  const blogIds = blogs.map((blog) => blog.id);
  await redis.lpush(`user:${userId}:blogs`, [...blogIds]);
  return await getCachedBlogs(blogIds);
};

export const getCachedUser = async (userId: string) => {
  let user: cachedUser | null = await redis.hgetall(`user${userId}`);
  if (!user) {
    user = await setUser(userId);
    if (!user) notFound();
  }
  return user;
};

export const getCachedUsers = async (userIds: string[]) => {
  if (userIds.length === 0) return [];
  const redisPipe = redis.pipeline();
  userIds.forEach((userId) => {
    redisPipe.hgetall(`user:${userId}`);
  });
  const users: any[] = await redisPipe.exec();
  const userDatas: cachedUser[] = await Promise.all(
    users.map(async (user, index) => {
      let u = user;
      if (!u) {
        u = await setUser(userIds[index]);
        if (!u) notFound();
      }
      return {
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        imageUrl: u.imageUrl,
        blogs: parseInt(u.blogs),
        followers: parseInt(u.followers),
      };
    })
  );
  return userDatas;
};


//TODO: Book Content, User List and User Feed
