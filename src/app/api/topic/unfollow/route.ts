import { TopicFollowSchema } from "@/type/topic";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { ZodError } from "zod";
export const POST = async (req: NextRequest) => {
    try {
        const { payload } = await req.json();
        const topicId = TopicFollowSchema.parse(payload);

        const { userId } = auth();
        if (!userId)
          return NextResponse.json({ error: "User Unauthorized" }, { status: 401 });

        const validTopic = await prisma.topic.findFirst({
          where: {
            id: topicId,
          },
        });
        if (!validTopic)
          return NextResponse.json({ error: "Topic Not Found" }, { status: 400 });
        
        await prisma.user.update({
          where: {
            id: userId
          },
          data: {
            blogs: {
              disconnect: {
                id: topicId
              }
            }
          }
        })
        return NextResponse.json({ message: 'sucess'}, {status : 200})  
    }catch(err){
        if(err instanceof ZodError){
            return NextResponse.json({ err: err.message}, {status: 400})
        }
    }
}
