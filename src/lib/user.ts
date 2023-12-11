import { auth } from "@clerk/nextjs"
import prisma from "./db";

export const getUserTopic = async () => {
    const { userId } = auth();
    if(!userId) return 
    const topics = await prisma.userToTopic.findMany({
        where: {
            user_id: userId
        },
        include: {
            topic: true
        }
    })
    return topics
}