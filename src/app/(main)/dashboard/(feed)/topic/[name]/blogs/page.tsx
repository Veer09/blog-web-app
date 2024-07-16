import BlogCard from "@/components/blog-view/BlogCard";
import NoBlog from "@/components/NoBlog";
import { Separator } from "@/components/ui/separator";
import { getBlogByTopic } from "@/lib/topic";
import React from "react";

const page = async ({ params }: { params: { name: string } }) => {
  const blogs = await getBlogByTopic(params.name);
  if (blogs.length === 0)
    return (
      <div className="w-[350px] gap-10 h-[300px] mx-[35%] my-[7%] flex flex-col text-xl justify-center font-bold text-center items-center">
        {" "}
        <NoBlog />
        <div>
          There are no blogs in this topic yet.
        </div>
      </div>
    );
  return (
    <div>
      {blogs.map((blog, key) => {
        return (
          <div key={key}>
            <BlogCard blog={blog} key={key} />
            <Separator />
          </div>
        );
      })}
    </div>
  );
};

export default page;
