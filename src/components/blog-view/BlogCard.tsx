"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cachedBlog } from "@/type/blog";
import { clerkClient, User } from "@clerk/nextjs/server";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";

interface BlogCardprops {
  blog: cachedBlog;
}

const BlogCard: FC<BlogCardprops> = ({ blog }) => {
  const router = useRouter();
  return (
    <Card
      className="w-full cursor-pointer px-6 py-2 grid gap-6 hover:shadow-lg transition-shadow duration-300"
      onClick={() => router.push(`/blog/${blog.id}`)}
    >
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <div className="flex items-center gap-4">
              <Avatar
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/user/${blog.authorId}`);
                }}
              >
                <AvatarImage height={4} width={4} src={blog.authorImage} />
                <AvatarFallback>{blog.authorName}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{blog.authorName}</h3>
                <p className="text-muted-foreground text-sm">
                  Published on {new Date(blog.createdAt).toDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-2">
            <h2 className="text-2xl font-bold">{blog.title}</h2>
            <p className="text-muted-foreground mt-2">{blog.description}</p>
            <div className="flex gap-2 mt-4 flex-wrap">
              {blog.topics.map((topic, key) => {
                return (
                  <Badge
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/topic/${topic}`);
                    }}
                    variant="outline"
                    key={key}
                  >
                    {topic}
                  </Badge>
                );
              })}
            </div>
          </div>
        </div>
        <div>
          {blog.coverImage && (
            <Image
              src={blog.coverImage}
              alt="dfgasrg"
              width="200"
              height="200"
              className="hidden lg:block"
            />
          )}
        </div>
      </div>
    </Card>
  );
};

export default BlogCard;
