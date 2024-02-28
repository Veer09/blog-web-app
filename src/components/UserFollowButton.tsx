"use client";
import React, { FC, useContext, useState } from "react";
import { Button } from "./ui/button";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { UserFollowSchema, cachedUser } from "@/type/user";
import axios, { AxiosError } from "axios";
import { ZodError } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "./ui/use-toast";

interface UserFollowButtonProps {
  user: cachedUser & { isFollowed: boolean, name: string}, 
  setUser: (user: cachedUser & { isFollowed: boolean, name: string}) => void
}

const UserFollowButton: FC<UserFollowButtonProps> = ({ user, setUser }) => {
  const router = useRouter();
  const queryClient = new QueryClient();

  const { mutate: follow, isPending: followPending } = useMutation({
    mutationKey: ['follow'],
    mutationFn: (id: string) => {
      const payload = UserFollowSchema.parse(id);
      return axios.post("/api/user/follow", {payload});
    },
    onMutate: () => {
      setUser({
        ...user,
        blogs: user.blogs,
        followers: (parseInt(user.followers) + 1).toString(),
        isFollowed: !user.isFollowed,
      });
    },
    onError: (err) => {
        if(err instanceof ZodError || err instanceof AxiosError){
            toast({ 
              title: "Incorrect Data",
              description: err.message,
              variant: 'destructive'
            })
        }
        router.refresh();
    },
  });

  const { mutate: unfollow, isPending: unfollowPending } = useMutation({
    mutationKey: ['follow'],
    mutationFn: (id: string) => {
      const payload = UserFollowSchema.parse(id)
      return axios.post('/api/user/unfollow', {payload})
    },
    onMutate: () => {
      setUser({
        ...user,
        blogs: user.blogs,
        followers: (parseInt(user.followers) - 1).toString(),
        isFollowed: !user.isFollowed,
      });    },
    onError: (err) => {
      if(err instanceof ZodError || err instanceof AxiosError){
        toast({ 
          title: "Incorrect Data",
          description: err.message,
          variant: 'destructive'
        })
      }
      router.refresh()
    }

  })
  return (
    <Button
      variant={user.isFollowed ? "outline" : "default"}
      onClick={(user.isFollowed) ? () => unfollow(user.id) : () => follow(user.id) }
      disabled={(followPending || unfollowPending) ? true : false}
    >
      {user.isFollowed ? "Following" : "Follow"}
    </Button>
  );
};

export default UserFollowButton;
