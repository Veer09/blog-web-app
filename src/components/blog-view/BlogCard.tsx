"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cachedBlog } from "@/type/blog";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FC } from "react";

interface BlogCardprops {
  blog: cachedBlog;
}

const BlogCard: FC<BlogCardprops> = ({ blog }) => {
  const router = useRouter();
  return (
    <Card className="w-full cursor-pointer p-6 grid gap-6 hover:shadow-lg transition-shadow duration-300" onClick={() => router.push(`/blog/${blog.id}`)}>
      <div className="flex justify-between items-center">
        <div>
          <div className="flex justify-between">
            <div className="flex items-center gap-4">
              <Avatar onClick={(e) => {
                e.stopPropagation();
                router.push(`/user/${blog.autherId}`)
              }}>
                <AvatarImage src={blog.coverImage} />
                <AvatarFallback>{blog.autherName}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{blog.autherName}</h3>
                <p className="text-muted-foreground text-sm">
                  Published on {blog.createdAt.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-2">
            <h2 className="text-2xl font-bold">
              {blog.title}
            </h2>
            <p className="text-muted-foreground mt-2">
              {blog.description}
            </p>
            <div className="flex gap-2 mt-4 flex-wrap">
              {
                blog.topics.map((topic, key) => {
                  return <Badge onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/topic/${topic}`)
                  }} variant="outline" key={key}>{topic}</Badge>
                })
              }
            </div>
          </div>
        </div>
        <div>
          <Image
            src={blog.coverImage}
            alt="dfgasrg"
            width="200"
            height="200"
            className="hidden lg:block"
          />
        </div>
      </div>
    </Card>
  );
};

export default BlogCard;
