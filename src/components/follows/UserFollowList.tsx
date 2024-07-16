"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cachedUser } from "@/type/user";
import { auth, clerkClient } from "@clerk/nextjs";
import { useInfiniteQuery } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { FC, use, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import ItemSelect from "./ItemSelect";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { handleClientError } from "@/lib/error";

interface UserFollowListProps {
  users: cachedUser[];
  isFollowed: boolean;
}

const UserFollowList: FC<UserFollowListProps> = ({ users, isFollowed }) => {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }
  const { ref, inView } = useInView({
    threshold: 1,
  });

  const getUser = async ({ pageParam = 1 }: { pageParam: unknown }) => {
    try {
      const response = await axios.get(
        `/api/user/${
          isFollowed ? "following" : "unfollowed"
        }/${userId}?page=${pageParam}`
      );
      return response.data.users as cachedUser[];
    } catch (err) {
      handleClientError(err);
    }
  };
  const { data, hasNextPage, isFetching, fetchNextPage } = useInfiniteQuery({
    queryKey: ["users"],
    queryFn: getUser,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage && lastPage.length === 7 ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    initialData: {
      pages: [users],
      pageParams: [1],
    },
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  const userArray = data.pages.flatMap((page) => page);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);
  if(data.pages[data.pages.length-1]) return <h1>Something went wrong!!</h1>
  return (
    <div>
      <ScrollArea className=" h-[80vh]">
        {userArray.map(async (user, key) => {
          const followObj = {
            ...user!,
            name:
              user!.firstName && user!.lastName
                ? user!.firstName + " " + user!.lastName
                : user!.firstName
                ? user!.firstName
                : user!.lastName
                ? user!.lastName
                : "",
            isFollowed,
          };
          return key === userArray.length - 1 ? (
            <div ref={ref} key={key}>
              <ItemSelect followObj={followObj} />
            </div>
          ) : (
            <div key={key}>
              <ItemSelect followObj={followObj} />
            </div>
          );
        })}
        <ClipLoader color="#000" loading={isFetching} size={150} />
      </ScrollArea>
    </div>
  );
};

export default UserFollowList;
