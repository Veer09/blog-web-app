import prisma from "@/lib/db";
import { ApiError, ErrorTypes, handleApiError } from "@/lib/error";
import { qstashClient } from "@/lib/qstash";
import { blogSchema, blogUploadSchema } from "@/type/blog";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  try {
    const blog = blogUploadSchema.parse(body);
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
        coverImage: blog.image,
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
      url: `${publishUrl}/api/qstash/publish-post`,
      body: {
        userId,
        blogData,
        topics,
      },
    });
    const response = blogSchema.parse(blogData.id);
    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    handleApiError(err);
  }
};
