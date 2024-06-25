import BlogCard from "@/components/BlogCard";
import InfiniteScrollPost from "@/components/InfiniteScrollPost";
import { Separator } from "@/components/ui/separator";
import { getFeedBlogs } from "@/lib/user";
import { FC } from "react";



const page: FC = async () => {

  const blogs = await getFeedBlogs(1);
  if (!blogs) return;
  return (
     <InfiniteScrollPost blogs={blogs} /> 
  );
};

export default page;
