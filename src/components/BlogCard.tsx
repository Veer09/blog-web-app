"use client";
import { useUser } from "@clerk/nextjs";
import { Blog } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { FC } from "react";

interface BlogCardprops {
  blog: Blog;
}

const BlogCard: FC<BlogCardprops> = ({ blog }) => {
  const router = useRouter();
  return (
    <div className=" flex gap-4 justify-between cursor-pointer items-center mx-10 h-44 " onClick={() => router.replace(`/blog/${blog.id}`)}>
      <div className=" flex flex-col justify-evenly h-full">
        <div>
          <p className=" text-xl font-bold py-3">{blog.title}</p>
          <p className=" text-sm text-slate-600">{blog.description}</p>
        </div>
        <p className=" text-xs">
          {"Published At" + " : " + blog.createdAt.toDateString()}
        </p>
      </div>
      {blog.coverImage ? (
        <img src={blog.coverImage} className=" h-24 w-24" alt="" />
      ) : null}
    </div>
  );
};

export default BlogCard;
