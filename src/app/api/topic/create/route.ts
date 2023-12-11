import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const POST = async (req: NextRequest) => {
    const { topic } = await req.json();
    await prisma.topic.create({
        data: {
            name: topic
        }
    })
    return NextResponse.json({ message : "Success"})
}