import { auth, useUser } from "@clerk/nextjs"
import prisma from "./db";
import { TopicWithCount, getAllTopic } from "./topic";
import { Blog } from "@prisma/client";

export const getUserTopic = async () => {
    const { userId } = auth();
    if(!userId) return 
    const topics = await prisma.user.findFirst({
        where:{
            id: userId
        },
        select: {
            topics: true
        }
    })
    return topics
}

export const getUserTopicCount = async () : Promise<TopicWithCount[] | null> => {
    const { userId } = auth();
    if(!userId) return null;

    const topics = await prisma.user.findFirst({
        where:{
            id: userId
        },
        select: {
            topics: {
                select:{
                    id: true,
                    name: true,
                    _count: true,
                    users: true
                }
            }
        }
    })
    if(!topics) return null;
    return topics.topics;
}

export const getFollowersCount = async () => {
    const { userId } = auth();
    const follower = await prisma.user.findMany({
        where: {
            id: userId as string
        },
        select: {
            followers: {
                select: {
                    
                }
            }
        }
    })
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

export const getUserBlogs = async () : Promise<Blog[] | null> => {
    const { userId } = auth();
    if(!userId) return null;
    const blogs = await prisma.blog.findMany({
        where: {
            user_id: userId
        }
    })
    return blogs;
}