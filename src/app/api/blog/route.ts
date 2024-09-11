import { blogFormSchema } from "@/type/blog";
import prisma from "@/lib/db";
import { ApiError, ErrorTypes, handleApiError } from "@/lib/error";
import { qstashClient } from "@/lib/qstash";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  try {
    const blog = blogFormSchema.parse(body);
    const { userId } = auth();
    if (!userId)
      throw new ApiError("Unauthorizesd!!", ErrorTypes.Enum.unauthorized);

    const topics = blog.topics.map((topic) => {
      return (
        topic.trim().charAt(0).toUpperCase() +
        topic.trim().slice(1).toLowerCase()
      );
    });

    const blogData = await prisma.blog.create({
      data: {
        user_id: userId,
        content: JSON.parse(JSON.stringify(blog.content)),
        title: blog.title,
        description: blog.description,
        coverImage: blog.coverImage,
        topics: {
          connectOrCreate: topics.map((topic) => {
            return {
              where: { name: topic },
              create: { name: topic },
            };
          }),
        },
      },
    });
    
    const publishUrl = req.url.split("/").slice(0, 3).join("/");
    await qstashClient.publishJSON({
      url: `https://d1fa-2409-40c1-1012-5890-9830-fefd-873d-568d.ngrok-free.app/api/qstash/publish-post`,
      body: {
        userId,
        blogData,
        topics,
      },
    });
    return NextResponse.json({ id: blogData.id });
  } catch (err) {
    console.log(err);
    const { message, code } = handleApiError(err);
    return NextResponse.json({ error: message }, { status: code });;
  }
};
