import React, { FC } from "react";
import prisma from "@/lib/db";
import { useUser } from "@clerk/nextjs";
import { getUserBlogs } from "@/lib/user";
import BlogCard from "@/components/BlogCard";
import { Separator } from "@/components/ui/separator";

const page: FC = async () => {
  const blogs = await getUserBlogs();
  if (!blogs) return <p>There is no Blogs!!</p>;
  return (
    <div className=" my-10 w-full flex items-center  justify-center">
      <div className=" w-[50%]">
        {blogs.map((blog, key) => {
          return (
            <div key={key}>
              <BlogCard blog={blog} key={key}/>
              <Separator />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default page;
