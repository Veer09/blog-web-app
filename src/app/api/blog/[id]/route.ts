import prisma from "@/lib/db";
import { ApiError, ErrorTypes, handleApiError } from "@/lib/error";
import { redis } from "@/lib/redis";
import { blogUploadSchema } from "@/type/blog";
import { auth } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";
import { permanentRedirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

interface UpdateBlog {
  title?: string;
  description?: string;
  coverImage?: string;
  content?: ReturnType<typeof JSON.parse>;
}

export const PUT = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const payload = await req.json();
  try {
    const { userId } = auth();
    if (!userId) {
      throw new ApiError(
        "Unauthorized!! Login first to access",
        ErrorTypes.Enum.unauthorized
      );
    }
    const blog = blogUploadSchema.parse(payload);
    let topics: string[] = [];
    if (blog.topics) {
      topics = blog.topics.map((topic) => {
        return (
          topic.trim().charAt(0).toUpperCase() +
          topic.trim().slice(1).toLowerCase()
        );
      });
    }
    const updateList: UpdateBlog = {};
    if (blog.title) updateList["title"] = blog.title;
    if (blog.description) updateList["description"] = blog.description;
    if (blog.coverImage) updateList["coverImage"] = blog.coverImage;
    if (blog.content)
      updateList["content"] = JSON.parse(JSON.stringify(blog.content));

    const update = await prisma.blog.update({
      where: {
        id: params.id,
        user_id: userId,
      },
      data: {
        ...updateList,
        topics: {
          connectOrCreate: topics.map((topic) => {
            return {
              where: { name: topic },
              create: { name: topic },
            };
          }),
        },
      },
    });

    //revalidate blog
    revalidateTag(`blog:${update.id}`);

    const redisPipe = redis.pipeline();

    //Create topic if not exists
    topics.forEach(async (topic) => {
      redisPipe.hsetnx(`topic:${topic}`, "name", topic);
      redisPipe.hsetnx(`topic:${topic}`, "blogs", 1);
      redisPipe.hsetnx(`topic:${topic}`, "followers", 0);
    });

    //Storing blog data
    redisPipe.hset(`blog:${update.id}`, {
      id: update.id,
      title: update.title,
      description: update.description,
      coverImage: update.coverImage,
    });

    await redisPipe.exec();

    return NextResponse.json({ message: "Success" });
  } catch (err) {
    const { message, code } = handleApiError(err);
    return NextResponse.json({ error: message }, { status: code });
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { userId } = auth();
  try {
    if (!userId) {
      throw new ApiError(
        "Unauthorized!! Login first to access",
        ErrorTypes.Enum.unauthorized
      );
    }
    const blog = await prisma.blog.delete({
      where: {
        id: params.id,
        user_id: userId,
      },
      select: {
        id: true,
        topics: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            followers: true,
          },
        },
      },
    });

    const redisPipe = redis.pipeline();

    //Delete blog from next cache
    revalidateTag(`blog:${blog.id}`);

    //Delete blog data
    redisPipe.del(`blog:${blog.id}`);

    //Delete blog from user list
    redisPipe.lrem(`user:${userId}:blogs`, 1, blog.id);

    //reduce blog count from user
    redisPipe.hincrby(`user:${userId}`, "blogs", -1);

    //reduce blog count from topic
    blog.topics.forEach(async (topic) => {
      redisPipe.hincrby(`topic:${topic.name}`, "blogs", -1);
    });

    //remove from followers feed
    blog.user.followers.forEach(async (follower) => {
      redisPipe.zrem(`user:${follower}:feed`, blog.id);
    });

    await redisPipe.exec();

    permanentRedirect('/me/blogs');
  } catch (err) {
    const { message, code } = handleApiError(err);
    return NextResponse.json({ error: message }, { status: code });
  }
};
