import BlogCard from "@/components/blog-view/BlogCard";
import { Separator } from "@/components/ui/separator";
import { getUserBlogs, setUserBlogs } from "@/lib/user";
import { cachedBlog } from "@/type/blog";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { FC } from "react";

const page: FC = async () => {
  const { userId } = auth();
  if(!userId) redirect("/sign-in");
  let blogs: cachedBlog[] | null = await getUserBlogs();
  if (!blogs) {
    blogs = await setUserBlogs();
    if (!blogs) return <div>no blogs</div>;
  }
  return (
    <div className=" my-10 w-full flex items-center  justify-center">
      <div className=" w-[100%]">
        {blogs.map((blog, key) => {
          return (
            <div key={key}>
              <BlogCard blog={blog} key={key}/>
              <Separator />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default page;
