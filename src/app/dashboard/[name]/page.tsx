import BlogView from "@/components/blog-post/BlogView";
import BlogCard from "@/components/general/blog/BlogCard";
import { findLatestBlog } from "@/lib/blog";
import React, { FC } from "react";
interface Props {
  params: {
    name: string;
  };
}
const page: FC<Props> = async ({ params }) => {
  const name = decodeURI(params.name);
  const blogs = await findLatestBlog(name);
  return (
    <div className=" w-[60%]">
      {blogs.map((blog) => {
        return <BlogCard blog={blog} />;
      })}
    </div>
  );
};

export default page;
