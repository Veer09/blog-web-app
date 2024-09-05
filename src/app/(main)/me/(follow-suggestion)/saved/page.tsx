import BlogCard from "@/components/blog-view/BlogCard";
import { getSavedBlog } from "@/lib/user";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { FC } from "react";
import Image from "next/image";
const page: FC = async () => {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  const savedBlog = await getSavedBlog(userId);
  if (savedBlog.length === 0)
    return (
      <div className="w-[350px] gap-10 h-[300px] mx-[35%] my-[7%] flex flex-col text-xl justify-center font-bold text-center items-center">
        {" "}
        <Image src="/MessyDoodle.svg" height={300} width={300} alt="No Blog"/>
        <div>
          You have{'\''}t saved any blog yet.
        </div>
      </div>
    );
  return (
    <div className="w-[80%]">
      {savedBlog.map((blog, key) => {
        return <BlogCard blog={blog} key={key} />;
      })}
    </div>
  );
};

export default page;
