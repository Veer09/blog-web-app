import prisma from "@/lib/db";
import { redis } from "@/lib/redis";
import { blogUploadSchema } from "@/type/blog";
import { auth } from "@clerk/nextjs";
import exp from "constants";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const payload  = await req.json();
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
    if(!userId) { return NextResponse.json({ message: "Unauthorized" }, { status: 400 }); }
    const update = await prisma.blog.update({
      where: {
        id: params.id,
        user_id: userId
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

      //Storing topic name in topics set
      redisPipe.sadd(`topics`, topic.name);
    });

    //Storing blog data
    redisPipe.hset(`blog:${update.id}`, {
      id: update.id,
      title: update.title,
      description: update.description,
      coverImage: update.coverImage,
    });

    await redisPipe.exec();

    return NextResponse.json({ message: "Success"})
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Something went wrong" }, { status: 400 });
  }
};


export const DELETE = async (req: NextRequest,
  { params }: { params: { id: string }}
) => {
  const { userId } = auth();
  if(!userId) { return NextResponse.json({ message: "Unauthorized" }, { status: 400 }); }
  try {
    const blog = await prisma.blog.delete({
      where: {
        id: params.id,
        user_id: userId
      },
      select: {
        id: true,
        topics: {
          select: {
            name: true
          }
        },
        user: {
          select: {
            followers: true
          }
        }
      }
    });


    //revalidate blog
    revalidateTag(`blog:${blog.id}`);

    const redisPipe = redis.pipeline();

    //Delete blog data
    redisPipe.del(`blog:${blog.id}`);

    //Remove blog from user's blog list
    redisPipe.lrem(`user:${userId}:blogs`, 0, blog.id);

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
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Something went wrong" }, { status: 400 });
  }
}