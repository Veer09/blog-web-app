import prisma from "./db";

export const findBlogById = async (blogId : string) => {
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

export const getBlog = async (blogId: string) => {
  const blog = await prisma.blog.findFirst({
    where: {
      id: blogId,
    },
    select: {
      title: true,
      description: true,
      content: true,
      coverImage: true,
      topics: true
    }
  });
  return blog;
}
