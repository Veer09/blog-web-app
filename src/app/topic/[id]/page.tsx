import BlogCard from "@/components/BlogCard";
import { Separator } from "@/components/ui/separator";
import { findLatestBlog } from "@/lib/blog";
import React, { FC } from "react";

interface Props {
  params: {
    id: string;
  };
}
const page: FC<Props> = async ({ params }) => {
  const blogs = await findLatestBlog(params.id);
  if (!blogs) return;
  return (
    <div className=" container my-10">
      <p className=" text-2xl font-bold text-left my-5">{params.id}</p>
      <Separator className=" h-[2px]" />
      {blogs.map((blog, key) => {
        return <BlogCard blog={blog} key={key} />;
      })}
    </div>
  );
};

export default page;
