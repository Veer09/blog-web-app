import BlogCard from "@/components/blog-view/BlogCard";
import NoBlog from "@/components/NoBlog";
import { getSavedBlog } from "@/lib/user";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React, { FC } from "react";

const page: FC = async () => {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  const savedBlog = await getSavedBlog(userId);
  if (savedBlog.length === 0)
    return (
      <div className="w-[350px] gap-10 h-[300px] mx-[35%] my-[7%] flex flex-col text-xl justify-center font-bold text-center items-center">
        {" "}
        <NoBlog />
        <div>
          You have not saved any blog yet.
        </div>
      </div>
    );
  return (
    <div>
      {savedBlog.map((blog, key) => {
        return <BlogCard blog={blog} key={key} />;
      })}
    </div>
  );
};

export default page;
