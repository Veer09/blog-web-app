import { TopicFollowSchema } from "@/type/topic";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { revalidatePath, revalidateTag } from "next/cache";

export const POST = async (req: NextRequest) => {
  try {
    const { payload } = await req.json();
    const topicId = TopicFollowSchema.parse(payload);

    const { userId } = auth();
    if (!userId)
      return NextResponse.json({ error: "User Unauthorized" }, { status: 401 });

    const alreadyFollowed = await prisma.user.findFirst({
      where: {
        id: userId,
        topics: {
          some: {
            id: topicId
          }
        }
      }
    })

    if (alreadyFollowed)
      return NextResponse.json({ error: "Already Followed" }, { status: 400 });
    
    const followObj = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        topics: {
          connect: {
            id: topicId
          }
        }
      }
    })
    revalidateTag('followedTopics');
    return NextResponse.json({ followObj });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
};
