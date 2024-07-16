import { handleApiError } from "@/lib/error";
import { redis } from "@/lib/redis";
import { blogPublishSchema } from "@/type/blog";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  try {
    const { userId, topics, blogData } = blogPublishSchema.parse(body);
    const userFollowers = await redis.smembers(`user:${userId}:followers`);
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
    redisPipe.hincrby(`user:${userId}`, "blogs", 1);
    //Storing blog in feed of user's followers
    userFollowers.forEach((follower) => {
      redisPipe.zadd(`user:${follower}:feed`, {
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
    handleApiError(err);
  }
};
