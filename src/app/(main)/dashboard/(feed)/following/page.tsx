import InfiniteScrollPost from "@/components/InfiniteScrollPost";
import { buttonVariants } from "@/components/ui/button";
import { getFeedBlogs } from "@/lib/user";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FC } from "react";

const page: FC = async () => {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  const blogs = await getFeedBlogs(userId, 1);
  if (blogs.length === 0)
    return (
      <div className="w-[350px] gap-10 h-[300px] mx-auto my-[20%] lg:my-[10%] flex flex-col text-xl justify-center font-bold text-center items-center">
        {" "}
        <Image src="/MessyDoodle.svg" height={300} width={300} alt="No Blog"/>
        <div className="flex flex-col gap-4 items-center">
          <div className=" text-2xl font-bold">No Post to Show!!</div>
          <Link href="/me/suggestions" className={`${buttonVariants()} w-40`}>Follow more users</Link>
        </div>
      </div>
    );
  return (
    <div className="flex flex-col gap-4">
      <InfiniteScrollPost blogs={blogs} />
    </div>
  );
};

export default page;
