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
    let topicsArray: string[] = [];
    if (blog.data.topics) {
      blog.data.topics.forEach(async (topic) => {
        let temp = topic.toLowerCase().split(' ');
        for (let i = 0; i < temp.length; i++) {
            temp[i] = temp[i].charAt(0).toUpperCase() + temp[i].slice(1);
        }
        topic = temp.join(' ');
        const uniqueTopics = await prisma.topic.upsert({
          where: {
            name: topic as string,
          },
          create: {
            name: topic as string,
          },
          update: {},
        });
        topicsArray.push(uniqueTopics.id);
      });
    }

    const blogData = await prisma.blog.create({
      data: {
        user_id: userId,
        content: JSON.parse(JSON.stringify(blog.data.content)),
        title: blog.data.title,
        description: blog.data.description,
        coverImage: blog.data.image,
        topics: {
          createMany: {
            data: topicsArray.map((topic) => {
              return { topic_id: topic };
            }),
          },
        },
      },
    });
    const response = blogSchema.parse(blogData);
    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err: err }, { status: 405 });
  }
};
