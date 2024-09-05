import { onlyBlog, cachedBlog } from "@/type/blog";
import { notFound } from "next/navigation";
import prisma from "./db";
import { redis } from "./redis";
import { getCachedUser } from "./user";

export const getBlogById = async (blogId : string) => {
  const blog = await prisma.blog.findFirst({
    where: {
      id: blogId,
    },
    include: {
      topics: true,
    }
  });
  return blog;
};

export const getBlogCommets = async (blogId: string) => {
  const comments = await prisma.comment.findMany({
    where: {
      blog_id: blogId,
    },
  });
  return comments;
}

export const  getMostLikedBlogs = async () => {
  const blogs = await prisma.blog.findMany({
    orderBy: {
      like: {
        _count: 'desc'
      }
    },
    take: 3
  });
  return blogs;
}


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
  return blogData;
};

export const getCachedBlogs = async (blogIds: string[]) => {
  if (blogIds.length === 0) return [];
  const redisPipe = redis.pipeline();
  blogIds.forEach((blogId) => {
    redisPipe.hgetall(`blog:${blogId}`);
  });
  const blogs: any[] = await redisPipe.exec();
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
        authorName: user.firstName && user.lastName
        ? user.firstName + " " + user.lastName    
        : user.firstName
        ? user.firstName
        : user.lastName
        ? user.lastName
        : "",
        authorImage: user.imageUrl,
      };
      return {
        id: blogData.id,
        title: blogData.title,
        description: blogData.description,
        coverImage: blogData.coverImage,
        createdAt: blogData.createdAt,
        likes: parseInt(blogData.likes),
        authorId: blogData.authorId,
        topics: blogData.topics,
        authorName: blogData.authorName,
        authorImage: blogData.authorImage,
      };
    })
  );
  return blogDatas;
};

