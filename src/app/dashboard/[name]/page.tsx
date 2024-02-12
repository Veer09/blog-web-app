import BlogView from "@/components/BlogView";
import BlogCard from "@/components/BlogCard";
import { findLatestBlog } from "@/lib/blog";
import { getFollowBlogs } from "@/lib/user";
import React, { FC } from "react";
interface Props {
  params: {
    name: string;
  };
}
const page: FC<Props> = async ({ params }) => {
  const name = decodeURI(params.name);
  let blogs;
  if (name === "following") {
    blogs = await getFollowBlogs();
  } else {
    blogs = await findLatestBlog(name);
  }
  if(!blogs) return ;
  return (
    <div className=" w-[50%]">
      {blogs.map((blog, key) => {
        return <BlogCard blog={blog} key={key} />;
      })}
    </div>
  );
};

export default page;
