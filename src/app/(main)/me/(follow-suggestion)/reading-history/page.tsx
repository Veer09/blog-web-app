import BlogCard from "@/components/blog-view/BlogCard";
import { buttonVariants } from "@/components/ui/button";
import { getUserReadingHistory } from "@/lib/user";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
const page = async () => {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  const blogs = await getUserReadingHistory(userId);
  if (blogs.length === 0)
    return (
      <div className="w-[350px] gap-10 h-[300px] mx-[35%] my-[7%] flex flex-col text-xl justify-center font-bold text-center items-center">
        {" "}
        <Image src="/MessyDoodle.svg" height={300} width={300} alt="No Blog"/>
        <div className="flex flex-col gap-4 items-center">
          <div className=" text-2xl font-bold">You haven{'\''}t read any blog yet!!</div>
          <Link href="/dashborad/following" className={`${buttonVariants()} w-40`}>Read your first blog</Link>
        </div>
      </div>
    );
  return (
    <div className="mt-5 w-[80%]">
      {blogs.map((blog) => {
        return <BlogCard key={blog.id} blog={blog} />;
      })}
    </div>
  );
};

export default page;
