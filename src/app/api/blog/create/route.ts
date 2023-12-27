import { blogUploadSchema } from "@/type/blog";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server"
export const POST = async (req: NextRequest) => {
    const body = await req.json();
    const blog = blogUploadSchema.safeParse(body);
    if(!blog.success){
        return NextResponse.json(blog.error, {status: 405});
    }
    // console.log(JSON.parse(JSON.stringify(blog.data)))
    const {userId} = auth()
    if(!userId){
        return NextResponse.json('Unauthorized', {status: 400});
    }
    const blogData = await prisma.blog.create({
        data: {
            user_id: userId,
            content: JSON.parse(JSON.stringify(blog.data.content)),
            title: blog.data.title,
            description: blog.data.description,
            coverImage: blog.data.image
        }
    })
    return NextResponse.json({ 'success': 1})
}

