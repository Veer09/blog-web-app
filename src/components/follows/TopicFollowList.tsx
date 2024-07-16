"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cachedTopic } from "@/type/topic";
import { useUser } from "@clerk/nextjs";
import { useInfiniteQuery } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { FC, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import ItemSelect from "./ItemSelect";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { handleClientError } from "@/lib/error";

interface TopicFollowListProps {
  topics: cachedTopic[];
  isFollowed: boolean;
}

const TopicFollowList: FC<TopicFollowListProps> = ({ topics, isFollowed }) => {
  const { user } = useUser();
  if (!user) {
    redirect("/sign-in");
  }
  const userId = user.id;
  const { ref, inView } = useInView();

  const getTopic = async ({ pageParam = 2 }: { pageParam: unknown }) => {
    try {
      const response = await axios.get(
        `/api/topic/${
          isFollowed ? "following" : "unfollowed"
        }/${userId}?page=${pageParam}`
      );
      return response.data.topics as cachedTopic[];
    } catch (err) {
      handleClientError(err);
    }
  };

  const { data, hasNextPage, isFetching, fetchNextPage } = useInfiniteQuery({
    queryKey: ["topics"],
    queryFn: getTopic,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage && lastPage.length === 7 ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    initialData: {
      pages: [topics],
      pageParams: [1],
    },
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  const topicArray = data.pages.flatMap((page) => page);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if(!data.pages[data.pages.length -1]) return <h1>Something went wrong!!</h1>

  return (
    <ScrollArea className=" h-[60vh]">
      {topicArray.map((topic, key) => {
        const followObj = {
          ...topic!,
          isFollowed,
        };
        return key === topicArray.length - 1 ? (
          <div key={key} ref={ref}>
            <ItemSelect followObj={followObj} />
          </div>
        ) : (
          <div key={key}>
            <ItemSelect followObj={followObj} />
          </div>
        );
      })}
      <div className="flex justify-center">
        <ClipLoader color="#000" loading={isFetching} size={30} />
      </div>
    </ScrollArea>
  );
};

export default TopicFollowList;
