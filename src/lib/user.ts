import { auth, useUser } from "@clerk/nextjs"
import prisma from "./db";
import { TopicWithCount, getAllTopic } from "./topic";

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

export const getUserTopicCount = async () : Promise<TopicWithCount[] | null> => {
    const { userId } = auth();
    if(!userId) return null;
    const topics = await prisma.userToTopic.findMany({
        where: {
            user_id: userId
        },
        select: {
            topic:{
                select: {
                    id: true,
                    name: true,
                    _count: true,
                    users: true
                }
            }
        }
    })
    return Array.from(topics.map(topic => topic.topic))
}

export const getUnfollowedTopics = async () : Promise<TopicWithCount[] | null> => {
    const { userId } = auth();
    if(!userId) return null;
    const allTopics = await getAllTopic(null);
    const followedTopics = await getUserTopicCount();
    if(!followedTopics) return allTopics;
    const unfollowedTopics = allTopics.filter(topic => {
        const a = followedTopics?.filter(t => t.id === topic.id);
        return a.length === 0
    })
    return unfollowedTopics
}