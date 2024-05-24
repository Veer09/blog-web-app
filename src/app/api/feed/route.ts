import { NextRequest, NextResponse } from "next/server";
import { getFeedBlogs } from "@/lib/user";

export const GET = async (req: NextRequest) => {
    const { searchParams } = new URL(req.url)
    const index = searchParams.get("index");
    if(!index) return NextResponse.json({ message : "Invalid index"}, { status : 400});
    const blogs = await getFeedBlogs(parseInt(index)); 
    return NextResponse.json(blogs);
}