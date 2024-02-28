import BlogCard from "@/components/BlogCard";
import React, { FC } from "react";
import { getBlogByTopic } from "@/lib/topic";

interface Props {
  params: {
    name: string;
  };
}
const page: FC<Props> = async ({ params }) => {  
  const name = decodeURI(params.name);
  let blogs;

  if (name === "following") {
    blogs = await getBlogByTopic('Hello');
  } else {
    blogs = await getBlogByTopic(name);
  }
  if(!blogs) return ;
  return (
    <div className=" w-[70%]">
      {blogs.map((blog, key) => {
        return <BlogCard blog={blog} key={key} />;
      })}
    </div>
  );
};

export default page;
