import { blogSchema, blogUploadSchema } from "@/type/blog";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const blog = blogUploadSchema.safeParse(body);

  if (!blog.success) {
    console.log(blog.error);
    return NextResponse.json(blog.error, { status: 405 });
  }

  const { userId } = auth();
  if (!userId) {
    return NextResponse.json("Unauthorized", { status: 400 });
  }
  try {
    const blogData = await prisma.blog.create({
      data: {
        user_id: userId,
        content: JSON.parse(JSON.stringify(blog.data.content)),
        title: blog.data.title,
        description: blog.data.description,
        coverImage: blog.data.image,
        topics: {
          connectOrCreate: (blog.data.topics) ? blog.data.topics.map((topic) => {
            return {
              where: { name: topic },
              create: { name: topic },
            };
          }) : undefined,
        },
      },
    });
    const response = blogSchema.parse(blogData);
    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err: err }, { status: 405 });
  }
};
