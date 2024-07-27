import prisma from "@/lib/db";
import { ApiError, ErrorTypes, handleApiError } from "@/lib/error";
import { redis } from "@/lib/redis";
import { blogUploadSchema } from "@/type/blog";
import { auth } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const payload = await req.json();
  try {
    const blog = blogUploadSchema.parse(payload);
    const topics = blog.topics.map((topic) => {
      return {
        name:
          topic.trim().charAt(0).toUpperCase() +
          topic.trim().slice(1).toLowerCase(),
      };
    });
    const { userId } = auth();
    if (!userId) {
      throw new ApiError(
        "Unauthorized!! Login first to access",
        ErrorTypes.Enum.unauthorized
      );
    }
    const update = await prisma.blog.update({
      where: {
        id: params.id,
        user_id: userId,
      },
      data: {
        content: JSON.parse(JSON.stringify(blog.content)),
        title: blog.title,
        description: blog.description,
        coverImage: blog.image,
        topics: {
          set: topics,
        },
      },
    });

    //revalidate blog
    revalidateTag(`blog:${update.id}`);

    const redisPipe = redis.pipeline();

    //Create topic if not exists
    topics.forEach(async (topic) => {
      redisPipe.hsetnx(`topic:${topic.name}`, "name", topic.name);
      redisPipe.hsetnx(`topic:${topic.name}`, "blogs", 1);
      redisPipe.hsetnx(`topic:${topic.name}`, "followers", 0);
      //revalidate topic
      revalidateTag(`topic:${topic.name}`);
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
    return NextResponse.json({ error: message }, { status: code });;
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { userId } = auth();
  if (!userId) {
    throw new ApiError(
      "Unauthorized!! Login first to access",
      ErrorTypes.Enum.unauthorized
    );
  }
  try {
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

    //revalidate blog
    revalidateTag(`blog:${blog.id}`);

    const redisPipe = redis.pipeline();

    //Delete blog data
    redisPipe.del(`blog:${blog.id}`);

    //Delete blog from user list
    redisPipe.lrem(`user:${userId}:blogs`, 1, blog.id);

    //reduce blog count from user
    redisPipe.hincrby(`user:${userId}`, "blogs", -1);

    //reduce blog count from topic
    blog.topics.forEach(async (topic) => {
      redisPipe.hincrby(`topic:${topic.name}`, "blogs", -1);
      revalidateTag(`topic:${topic.name}`);
    });

    //remove from followers feed
    blog.user.followers.forEach(async (follower) => {
      redisPipe.zrem(`user:${follower}:feed`, blog.id);
    });

    return NextResponse.json({ message: "Success" });
  } catch (err) {
        const { message, code } = handleApiError(err);
    return NextResponse.json({ error: message }, { status: code });;
  }
};
