import { auth, useUser } from "@clerk/nextjs"
import prisma from "./db";
import { TopicWithCount, getAllTopic } from "./topic";
import { Blog } from "@prisma/client";

export const getUserWithCounts = async () => {
    const { userId } = auth();
    if(!userId) return ;
    const users = await prisma.user.findFirst({
        where: {
            id: userId
        },
        select: {
            following: {
                select: {
                    id: true,
                    _count: true,
                }
            }
        }
    })
    return users 
}

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

export const getSavedBlog = async () => {
    const { userId } = auth();
    if(!userId) return;
    const savedBlog = await prisma.user.findFirst({
        where: {
            id: userId
        },
        select: {
            saved_blog: true
        }
    })
    if(!savedBlog) return ;
    return savedBlog.saved_blog;
}

export const isBlogSaved = async ( blogId: string ) => {
    const { userId } = auth();
    if(!userId) return false;
    const blog = await prisma.user.findFirst({
        where: {
            id: userId,
            saved_blog: {
                some: {
                    id: blogId
                }
            }
        }
    })
    if(!blog) return false
    return true;
}