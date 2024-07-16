import InfiniteScrollPost from "@/components/InfiniteScrollPost";
import NoBlog from "@/components/NoBlog";
import { Button, buttonVariants } from "@/components/ui/button";
import { getFeedBlogs } from "@/lib/user";
import { auth } from "@clerk/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FC } from "react";

const page: FC = async () => {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  const blogs = await getFeedBlogs(userId, 1);
  if (blogs.length === 0)
    return (
      <div className="w-[350px] gap-10 h-[300px] mx-[35%] my-[7%] flex flex-col text-xl justify-center font-bold text-center items-center">
        {" "}
        <NoBlog />
        <div>
          <Link href="/me/suggestions" className={`${buttonVariants()}`}>Follow more users</Link>
        </div>
      </div>
    );
  return (
    <div>
      <InfiniteScrollPost blogs={blogs} />
    </div>
  );
};

export default page;
