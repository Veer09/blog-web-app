import { redis } from "@/lib/redis";
import { blogSchema, blogUploadSchema } from "@/type/blog";
import { auth } from "@clerk/nextjs";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const blog = blogUploadSchema.safeParse(body);

  if (!blog.success) {
    console.log(blog.error);
    return NextResponse.json(blog.error, { status: 405 });
  }

  const { userId } = auth();
  if (!userId) {
    return NextResponse.json("Unauthorized", { status: 400 });
  }
  if (!blog.data.topics) {
    blog.data.topics = [];
  }
  const topics = blog.data.topics.map((topic) => {
    return (
      topic.trim().charAt(0).toUpperCase() + topic.trim().slice(1).toLowerCase()
    );
  });
  try {
    const blogData = await prisma.blog.create({
      data: {
        user_id: userId,
        content: JSON.parse(JSON.stringify(blog.data.content)),
        title: blog.data.title,
        description: blog.data.description,
        coverImage: blog.data.image,
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
    const userFollowers = await redis.smembers(`user:${userId}:followers`);
    const redisPipe = redis.pipeline();

    //Create topic if not exists
    topics.forEach(async (topic) => {
      redisPipe.hsetnx(`topic:${topic}`, "name", topic);
      redisPipe.hsetnx(`topic:${topic}`, "blogs", 1);
      redisPipe.hsetnx(`topic:${topic}`, "followers", 0);

      //Storing topic name in topics set
      redisPipe.sadd(`topics`, topic);
    });

    //Storing blog data
    redisPipe.hset(`blog:${blogData.id}`, {
      id: blogData.id,
      title: blogData.title,
      description: blogData.description,
      coverImage: blogData.coverImage,
      createdAt: blogData.createdAt,
    });

    //Storing blog information in user's blog list
    redisPipe.lpush(`user:${userId}:blogs`, blogData.id);

    //Storing blog in feed of user's followers
    userFollowers.forEach((follower) => {
      redisPipe.zadd(`user:${follower}:feed`, {
        score: Date.now(),
        member: blogData.id,
      });
    });

    await redisPipe.exec();

    const response = blogSchema.parse(blogData.id);
    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ err: err }, { status: 405 });
  }
};
