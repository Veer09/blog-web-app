import InfiniteScrollPost from "@/components/InfiniteScrollPost";
import { getFeedBlogs } from "@/lib/user";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { FC } from "react";



const page: FC = async () => {
  const { userId } = auth();
  if(!userId) redirect("/sign-in");
  const blogs = await getFeedBlogs(1);
  if (!blogs) return;
  return (
     <InfiniteScrollPost blogs={blogs} /> 
  );
};

export default page;
