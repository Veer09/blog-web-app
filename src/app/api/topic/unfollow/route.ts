import { TopicFollowSchema } from "@/type/topic";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { ZodError } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";
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
            topics: {
              disconnect: {
                id: topicId
              }
            }
          }
        })
        revalidateTag('followedTopics');
        return NextResponse.json({ message: 'sucess'}, {status : 200})  
    }catch(err: any){
        if(err instanceof ZodError){
            return NextResponse.json({ err: err.message}, {status: 400})
        }
        return NextResponse.json({ err: err.message}, {status: 400})
    }
}
