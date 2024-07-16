import BlogCard from "@/components/blog-view/BlogCard";
import NoBlog from "@/components/NoBlog";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getUserBlogs, setUserBlogs } from "@/lib/user";
import { cachedBlog } from "@/type/blog";
import { auth } from "@clerk/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FC } from "react";

const page: FC = async () => {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  let blogs: cachedBlog[] = await getUserBlogs(userId);
  if (blogs.length === 0)
    return (
      <div className="w-[350px] gap-10 h-[300px] mx-[35%] my-[7%] flex flex-col text-xl justify-center font-bold text-center items-center">
        {" "}
        <NoBlog />
        <div>
          <Link href="/blog/create" className={`${buttonVariants()}`}>
            Write your first blog
            </Link>
        </div>
      </div>
    );
  return (
    <div className=" my-10 w-full flex items-center  justify-center">
      <div className=" w-[100%]">
        {blogs.map((blog, key) => {
          return (
            <div key={key}>
              <BlogCard blog={blog} key={key} />
              <Separator />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default page;
