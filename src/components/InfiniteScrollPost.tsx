"use client";
import { cachedBlog } from "@/type/blog";
import React, { FC } from "react";
import BlogCard from "./BlogCard";
import { Separator } from "./ui/separator";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import axios from "axios";
import { toast } from "./ui/use-toast";

interface InfiniteScrollPostProps {
  blogs: cachedBlog[];
}

const InfiniteScrollPost: FC<InfiniteScrollPostProps> = ({ blogs }) => {
  const { ref, inView } = useInView({
    threshold: 1,
  });
  const getPosts = async (pageParam = 1) => {
    const response = await axios.get(`/api/feed?index=${pageParam}`);
    if (response.status !== 200) {
      toast({
        variant: "destructive",
        title: "Something went wrong!!",
      });
    }
    return response.data as cachedBlog[];
  };
  const { data, hasNextPage, isFetching, fetchNextPage } = useInfiniteQuery({
    queryKey: ["blogs"],
    queryFn: ({ pageParam = 1 }) => getPosts(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length == 5 ? allPages.length + 1 : undefined;
    },
    initialData: {
      pages: [blogs],
      pageParams: [1],
    },
    initialPageParam: 1,
  });
  
  const blogsArray = data.pages.flatMap((page) => page);
  if(inView && hasNextPage){
    fetchNextPage();
  }
  return (
    <div className=" w-[70%]">
      {blogsArray.map((blog, key) => {
        return key === blogsArray.length - 1 ? (
          <div key={key} ref={ref}>
            <BlogCard blog={blog} />
            <Separator />
          </div>
        ) : (
          <div key={key}>
            <BlogCard blog={blog} />
            <Separator />
          </div>
        );
      })}
      { isFetching && <div>Loading...</div>}
    </div>
  );
};

export default InfiniteScrollPost;
