import { cachedBlog, onlyBlog } from "@/type/blog";
import { cachedTopic } from "@/type/topic";
import { cachedUser } from "@/type/user";
import { auth, clerkClient } from "@clerk/nextjs/server";
import prisma from "./db";
import { redis } from "./redis";
import { BookMetaData, cachedBook } from "@/type/book";
import { notFound } from "next/navigation";

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

export const findDraftById = async (draftId: string, userId: string) => {
  const draft = await prisma.draft.findUnique({
    where: {
      id: draftId,
      user_id: userId,
    },
  });
  if (!draft) notFound();
  return draft;
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

export const getFeedBlogs = async (userId: string, index: number) => {
  const count = 5;

  const feed: string[] = await redis.zrange(
    `user:${userId}:feed`,
    (index - 1) * count,
    index * count - 1
  );

  return await getCachedBlogs(feed);
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

export const setBook = async (bookId: string) => {
  const book = await prisma.book.findUnique({
    where: {
      id: bookId,
    },
    select: {
      topic_name: true,
      title: true,
      description: true,
      author_id: true,
      _count: {
        select: {
          followers: true,
        },
      },
    },
  });
  if (!book) return null;
  const bookData = {
    id: bookId,
    title: book.title,
    description: book.description,
    topic: book.topic_name!,
    userId: book.author_id,
    followers: book._count.followers,
  };
  return bookData;
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
      topics: true,
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
  const blogData: onlyBlog = {
    id: blogId,
    title,
    description,
    coverImage,
    createdAt,
    likes: like,
    authorId: user_id,
    topics: blog.topics.map((topic) => topic.name),
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
  const users: (cachedUser | null)[] = await redisPipe.exec();
  const userDatas: cachedUser[] = await Promise.all(
    users.map(async (user, index) => {
      let u = user;
      if (!u) {
        u = await setUser(userIds[index]);
        if (!u) notFound();
      }
      return u;
    })
  );
  return userDatas;
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
  const topics: (cachedTopic | null)[] = await redisPipe.exec();
  const topicDatas: cachedTopic[] = await Promise.all(
    topics.map(async (topic, index) => {
      let t = topic;
      if (!t) {
        t = await setTopic(topicIds[index]);
        if (!t) notFound();
      }
      return t;
    })
  );
  return topicDatas;
};

export const getCachedBook = async (bookId: string) => {
  let book = await redis.hgetall(`book:${bookId}`);
  if (!book) {
    book = await setBook(bookId);
    if (!book) notFound();
  }
  return book;
};

export const getCachedBooks = async (bookIds: string[]) => {
  if (bookIds.length === 0) return [];
  const redisPipe = redis.pipeline();
  bookIds.forEach((bookId) => {
    redisPipe.hgetall(`book:${bookId}`);
  });
  const books: (BookMetaData | null)[] = await redisPipe.exec();
  const bookDatas: BookMetaData[] = await Promise.all(
    books.map(async (book, index) => {
      let b = book;
      if (!b) {
        b = await setBook(bookIds[index]);
        if (!b) notFound();
      }
      return b;
    })
  );
  return bookDatas;
};

export const getCachedBlog = async (blogId: string) => {
  let blog: onlyBlog | null = await redis.hgetall(`blog:${blogId}`);
  if (!blog) {
    blog = await setBlog(blogId);
    if (!blog) notFound();
  }
  const user = await getCachedUser(blog.authorId);
  const blogData = {
    ...blog,
    authorName: user.firstName + " " + user.lastName,
    authorImage: user,
  };
  return blog;
};

export const getCachedBlogs = async (blogIds: string[]) => {
  if (blogIds.length === 0) return [];
  const redisPipe = redis.pipeline();
  blogIds.forEach((blogId) => {
    redisPipe.hgetall(`blog:${blogId}`);
  });
  const blogs: (onlyBlog | null)[] = await redisPipe.exec();
  const blogDatas: cachedBlog[] = await Promise.all(
    blogs.map(async (blog, index) => {
      let b = blog;
      if (!b) {
        b = await setBlog(blogIds.at(index)!);
        if (!b) notFound();
      }
      const user = await getCachedUser(b.authorId);
      const blogData = {
        ...b,
        authorName: user.firstName + " " + user.lastName,
        authorImage: user.imageUrl,
      };
      return blogData;
    })
  );
  return blogDatas;
};

//TODO: Book Content, User List and User Feed
