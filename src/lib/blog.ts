export const findBlogById = async (blogId : string) => {
  const blog = await prisma.blog.findFirst({
    where: {
      id: blogId,
    },
  });
  return blog;
};

export const findLatestBlog = async (topicName : string) => {
  const blogs = await prisma.blog.findMany({
    where: {
      topics: {
        some: {
          name: topicName
        }
      }
    }
  })
  return blogs
}