"use client";
import React, { FC, useContext, useState } from "react";
import { Button } from "./ui/button";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { TopicDetails, TopicFollowSchema } from "@/type/topic";
import axios, { AxiosError } from "axios";
import { ZodError } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "./ui/use-toast";

interface TopicFollowButtonProps {
  topic: TopicDetails & { isFollowed: boolean}, 
  setTopic: (topic: TopicDetails & { isFollowed: boolean}) => void
}

const TopicFollowButton: FC<TopicFollowButtonProps> = ({ topic, setTopic }) => {
  const router = useRouter();
  const queryClient = new QueryClient();

  const { mutate: follow, isPending: followPending } = useMutation({
    mutationKey: ['follow'],
    mutationFn: (id: string) => {
      const payload = TopicFollowSchema.parse(id);
      return axios.post("/api/topic/follow", {payload});
    },
    onMutate: () => {
      setTopic({...topic, _count: { users: topic._count.users + 1, blogs: topic._count.blogs }, isFollowed: !topic.isFollowed});
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
      const payload = TopicFollowSchema.parse(id)
      return axios.post('/api/topic/unfollow', {payload})
    },
    onMutate: () => {
      setTopic({...topic, _count: { users: topic._count.users - 1, blogs: topic._count.blogs}, isFollowed: !topic.isFollowed});
    },
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
      variant={topic.isFollowed ? "outline" : "default"}
      onClick={(topic.isFollowed) ? () => unfollow(topic.id) : () => follow(topic.id) }
      disabled={(followPending || unfollowPending) ? true : false}
    >
      {topic.isFollowed ? "Following" : "Follow"}
    </Button>
  );
};

export default TopicFollowButton;
