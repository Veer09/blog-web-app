import { redis } from "@/lib/redis";
import { UserFollowAddSchema } from "@/type/user";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    const body = await req.json();
    try{
        const { userId, followerId } = UserFollowAddSchema.parse(body);
        if (userId === followerId) 
            return NextResponse.json({ error: "User canno follow itself" }, { status: 400 });

        const userBlogs = await redis.lrange(`user:${userId}:blogs`, 0, -1);
        const redisPipeline = redis.pipeline();
        userBlogs.forEach((blogId) => {
            redisPipeline.hget(`blog:${blogId}`, "createdAt");
        });
        const blogDates:string[] = await redisPipeline.exec();
        console.log(blogDates);
        const newPipeline = redis.pipeline();
        userBlogs.forEach((blogId, index) => {
            newPipeline.zadd(`user:${followerId}:feed`, {
                score: new Date(blogDates[index]).getTime(),
                member: blogId
            });
        })
        await newPipeline.exec();
        return NextResponse.json({ message: "User followed" }, { status: 200 });
    }catch(err: any){   
        console.log(err);
    }
}