import BlogCard from "@/components/BlogCard";
import { Separator } from "@/components/ui/separator";
import { getBlogByTopic } from "@/lib/topic";
import React from "react";

const page = async ({ params }: { params: { name: string } }) => {
  const blogs = await getBlogByTopic(params.name);
  if (!blogs) return <div>no blogs</div>;
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
