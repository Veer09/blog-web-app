import BlogCard from "@/components/blog-view/BlogCard";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getUserBlogs } from "@/lib/user";
import { cachedBlog } from "@/type/blog";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FC } from "react";
const page: FC = async () => {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  let blogs: cachedBlog[] = await getUserBlogs(userId);
  if (blogs.length === 0)
    return (
      <div className="w-[350px] gap-10 h-[300px] mx-auto my-[20%] lg:my-[10%] flex flex-col text-xl justify-center font-bold text-center items-center">
        {" "}
        <Image src="/MessyDoodle.svg" height={300} width={300} alt="No Blog"/>
        <div className="flex flex-col gap-4 items-center">
          <div className=" text-2xl font-bold">You haven{'\''}t created any blog</div>
          <Link href="/dashborad/following" className={`${buttonVariants()} w-40`}>Write your first blog</Link>
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
