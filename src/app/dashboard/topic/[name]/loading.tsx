import BlogCard from "@/components/BlogCard";
import BlogCardSkeleton from "@/components/BlogCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const loading = () => {
  return (
    <div className=" w-[70%] my-5 flex flex-col gap-3">
      {
        Array(5).fill(0).map((_, key) => {
          return <BlogCardSkeleton key={key} />
        })
      }
    </div>
    
  );
};

export default loading;
