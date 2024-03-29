import { unstable_cache, unstable_noStore } from "next/cache";
import prisma from "./db";
import { auth } from "@clerk/nextjs";

export const findBlogById = async (blogId : string) => {
  const { userId } = auth();
  if(!userId) return;
  const blog = await prisma.blog.findFirst({
    where: {
      id: blogId,
    },
    include: {
      topics: true,
      comments: true,
      _count: {
        select: {
          like: true,
        }
      }
    }
  });
  return blog;
};

