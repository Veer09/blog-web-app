import prisma from "@/lib/db";
import { redis } from "@/lib/redis";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, { params } : {params : {id: string}}) => { 
    const { userId } = auth();

    if(!userId){
        return NextResponse.json({message: "Unauthorized"}, {status: 401})
    }

    await prisma.book.update({
        where: {
            id: params.id
        },
        data: {
            followers: {
                disconnect: {
                    id: userId
                }
            }
        }
    })

    await redis.hincrby(`book:${params.id}:meta`, "followers", -1);
    return NextResponse.json({message: "Unfollowed"}, {status: 200});
}