import BlogCard from "@/components/blog-view/BlogCard";
import NoBlog from "@/components/NoBlog";
import { buttonVariants } from "@/components/ui/button";
import { getUserReadingHistory } from "@/lib/user";
import { auth } from "@clerk/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  const blogs = await getUserReadingHistory(userId);
  if (blogs.length === 0)
    return (
      <div className="w-[350px] gap-10 h-[300px] mx-[35%] my-[7%] flex flex-col text-xl justify-center font-bold text-center items-center">
        {" "}
        <NoBlog />
        <Link href="/dashboard/following" className={`${buttonVariants()}`}>Read your first blog</Link>
      </div>
    );
  return (
    <div>
      {blogs.map((blog) => {
        return <BlogCard key={blog.id} blog={blog} />;
      })}
    </div>
  );
};

export default page;
