"use client";
import { cachedBlog } from "@/type/blog";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { FC, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import ClipLoader from "react-spinners/ClipLoader";
import BlogCard from "./blog-view/BlogCard";
import { Separator } from "./ui/separator";
import { toast } from "./ui/use-toast";
import { handleClientError } from "@/lib/error";
import { notFound } from "next/navigation";

interface InfiniteScrollPostProps {
  blogs: cachedBlog[];
}

const InfiniteScrollPost: FC<InfiniteScrollPostProps> = ({ blogs }) => {
  const { ref, inView } = useInView({
    threshold: 1,
  });
  const getPosts = async ({ pageParam = 1 }: { pageParam: number }) => {
    try {
      const response = await axios.get(`/api/feed?index=${pageParam}`);
      return response.data as cachedBlog[];
    } catch (err) {
      handleClientError(err);
    }

  };
  const { data, hasNextPage, isFetching, fetchNextPage } = useInfiniteQuery({
    queryKey: ["blogs"],
    queryFn: getPosts,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage && lastPage.length === 5 ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    initialData: {
      pages: [blogs],
      pageParams: [1],
    },
  });

  const blogsArray = data.pages.flatMap((page) => page);
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if(!data.pages[data.pages.length - 1]) return (<h1>Something went wrong!!</h1>)
  return (
    <div className=" w-[70%]">
      {blogsArray.map((blog, key) => {
        return key === blogsArray.length - 1 ? (
          <div key={key} ref={ref}>
            <BlogCard blog={blog!} />
            <Separator />
          </div>
        ) : (
          <div key={key}>
            <BlogCard blog={blog!} />
            <Separator />
          </div>
        );
      })}
      <ClipLoader color="#000" loading={isFetching} size={150} />
    </div>
  );
};

export default InfiniteScrollPost;
