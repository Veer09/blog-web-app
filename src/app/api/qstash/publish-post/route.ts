import prisma from "@/lib/db";
import { handleApiError } from "@/lib/error";
import { redis } from "@/lib/redis";
import { blogPublishSchema, cachedBlog, onlyBlog } from "@/type/blog";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  try {
    const { userId, topics, blogData } = blogPublishSchema.parse(body);
    const redisPipe = redis.pipeline();

    
    //Create topic if not exists
    topics.forEach(async (topic) => {
      redisPipe.hsetnx(`topic:${topic}`, "name", topic);
      redisPipe.hsetnx(`topic:${topic}`, "blogs", 1);
      redisPipe.hsetnx(`topic:${topic}`, "followers", 0);

      //revalidate topic
      revalidateTag(`topic:${topic}`);

      //Storing topic name in topics set
      redisPipe.sadd(`topics`, topic);
    });

    const blog: onlyBlog = {
      id: blogData.id,
      title: blogData.title,
      description: blogData.description,
      coverImage: blogData.coverImage,
      createdAt: blogData.createdAt,
      authorId: userId,
      likes: 0,
      topics: topics,
    }

    //Storing blog data
    redisPipe.hset(`blog:${blogData.id}`, blog);

    //Storing blog information in user's blog list
    redisPipe.lpush(`user:${userId}:blogs`, blogData.id);
    redisPipe.hincrby(`user:${userId}`, "blogs", 1);

    const userFollowers = await prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        followers: true
      }
    }).then(user => user?.followers);
    if(!userFollowers) return NextResponse.json("Something went wrong!!", { status: 500 });
    //Storing blog in feed of user's followers
    userFollowers.forEach((follower) => {
      redisPipe.zadd(`user:${follower.id}:feed`, {
        score: Date.now(),
        member: blogData.id,
      });
    });

    await redisPipe.exec();
    return NextResponse.json(
      { message: "Published Successfully!!" },
      { status: 200 }
    );
  } catch (err) {
        const { message, code } = handleApiError(err);
    return NextResponse.json({ error: message }, { status: code });;
  }
};
