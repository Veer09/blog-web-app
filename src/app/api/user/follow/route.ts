import prisma from "@/lib/db";
import { qstashClient } from "@/lib/qstash";
import { redis } from "@/lib/redis";
import { UserFollowSchema } from "@/type/user";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { payload } = await req.json();
    const followerId = UserFollowSchema.safeParse(payload);
    const { userId } = auth();
    if (!userId)
      return NextResponse.json({ error: "User Unauthorized" }, { status: 401 });
    if(!followerId.success)
      return NextResponse.json({ error: "Invalid followerId" }, { status: 400 });
    if (followerId.data === userId)     
        return NextResponse.json({ error: "User cannot follow itself" }, { status: 400 });

    await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            following: {
                connect: {
                    id: followerId.data
                }
            }
        }
    });
    await redis.hincrby(`user:${followerId.data}`, "followers", 1);
    const publishUrl = req.url.split("/").slice(0, 3).join("/");
    await qstashClient.publishJSON({
      url: `https://abc.requestcatcher.com/api/qstash/publish-post`,
      body: {
        userId,
        followerId: followerId.data
      }
    })
    return NextResponse.json({ message: "User followed" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
};
