
export const getBlogByTopic = async (topicName : string) => {
  const blogs = await prisma.blog.findMany({
    where: {
      topics: {
        some: {
          name: topicName
        }
      }
    },
    select: {
      id: true,
      title: true,
      createdAt: true,
      description: true,
      coverImage: true,
    }
  })
  return blogs.map(blog => { return { ...blog, createdAt: blog.createdAt.toString()} })
}

