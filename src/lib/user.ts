import { auth } from "@clerk/nextjs";
import prisma from "./db";
import { TopicDetails } from "@/type/topic";
import { Blog, Topic } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { UserDetails } from "@/type/user";

export const getUserWithCounts = async (): Promise<UserDetails[] | null> => {
  const { userId } = auth();
  if (!userId) return null;
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      following: {
        select: {
          id: true,
          _count: true,
        },
      },
    },
  });
  if (!user) return null;
  return user.following;
};

export const getUserFollowingDetails = async (
  count: number | undefined
): Promise<UserDetails[]> => {
  const { userId } = auth();
  if (!userId) return [];
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      following: {
        select: {
          id: true,
          _count: {
            select: {
              followers: true,
              blogs: true,
            },
          },
        },
        orderBy: {
          followers: {
            _count: "desc",
          },
        },
        take: count,
      },
    },
  });
  if (!user) return [];
  return user.following;
};

export const getUnfollowedUsers = async (
  count: number | undefined
): Promise<UserDetails[]> => {
  const { userId } = auth();
  if (!userId) return [];
  const users = await prisma.user.findMany({
    where: {
      followers: {
        none: {
          id: userId,
        },
      },
      id: {
        not: userId,
      }
    },
    select: {
      id: true,
      _count: {
        select: {
          followers: true,
          blogs: true,
        },
      },
    },
    orderBy: {
      followers: {
        _count: "desc",
      },
    },
    take: count,
  });
  return users;
};

export const getUserTopic = unstable_cache(
  async () => {
    const { userId } = auth();
    if (!userId) return null;
    const topics = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        topics: true,
      },
    });
    return topics;
  },
  ["topics", "followed"],
  {
    tags: ["followedTopics"],
  }
);

export const getUserTopicDetail = unstable_cache(
  async (count: number | undefined): Promise<TopicDetails[]> => {
    const { userId } = auth();
    if (!userId) return [];

    const topics = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        topics: {
          select: {
            id: true,
            name: true,
            _count: true,
            users: true,
          },
          take: count,
        },
      },
    });
    if (!topics) return [];
    return topics.topics;
  },
  ["topics", "followedCount"],
  {
    tags: ["followedTopics"],
  }
);

export const getUnfollowedTopics = unstable_cache(
  async (count: number | undefined): Promise<TopicDetails[]> => {
    const { userId } = auth();
    if (!userId) return [];

    const unfollowedTopics = await prisma.topic.findMany({
      where: {
        users: {
          none: {
            id: userId,
          },
        },
      },
      include: {
        _count: true,
        users: true,
      },
      take: count,
    });
    return unfollowedTopics;
  },
  ["topics", "unfollowed"],
  {
    tags: ["followedTopics"],
  }
);

export const getUserBlogs = async (): Promise<Blog[] | null> => {
  const { userId } = auth();
  if (!userId) return null;
  const blogs = await prisma.blog.findMany({
    where: {
      user_id: userId,
    },
  });
  return blogs;
};

export const getSavedBlog = async () => {
  const { userId } = auth();
  if (!userId) return;
  const savedBlog = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      saved_blog: true,
    },
  });
  if (!savedBlog) return;
  return savedBlog.saved_blog;
};

export const getFollowBlogs = async () => {
  const { userId } = auth();
  if (!userId) return;
  const blogs = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      following: {
        select: {
          blogs: true,
        },
      },
    },
  });
  if (!blogs) return;
  let blogsArray: Blog[] = [];
  blogs.following.forEach((following) => {
    following.blogs.forEach((blogs) => {
      blogsArray.push(blogs);
    });
  });
  blogsArray.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  return blogsArray;
};

export const isBlogSaved = async (blogId: string) => {
  const { userId } = auth();
  if (!userId) return false;
  const blog = await prisma.user.findFirst({
    where: {
      id: userId,
      saved_blog: {
        some: {
          id: blogId,
        },
      },
    },
  });
  if (!blog) return false;
  return true;
};

export const isBlogLiked = async (blogId: string) => {
  const { userId } = auth();
  if (!userId) return false;
  const blog = await prisma.like.findUnique({
    where: {
      user_id_blog_id: {
        user_id: userId,
        blog_id: blogId,
      },
    },
  });
  if (!blog) return false;
  return true;
}