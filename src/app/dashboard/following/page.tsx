import BlogCard from "@/components/BlogCard";
import React, { FC } from "react";
import { getBlogByTopic } from "@/lib/topic";
import { getFeedBlogs } from "@/lib/user";
import { Separator } from "@/components/ui/separator";
import { unstable_cache } from "next/cache";
import { cachedBlog } from "@/type/blog";
import InfiniteScrollPost from "@/components/InfiniteScrollPost";

interface Props {
  params: {
    name: string;
  };
}

const page: FC<Props> = async ({ params }) => {
  const name = decodeURI(params.name);
  const blogs = await getFeedBlogs(1);
  if (!blogs) return;
  return (
    (name === "following") ? <InfiniteScrollPost blogs={blogs} /> : <div>
      {blogs.map((blog, key) => {
        return (
          <div key={key}>
            <BlogCard blog={blog} />
            <Separator />
          </div>
        );
      })}
    </div>
  );
};

export default page;
