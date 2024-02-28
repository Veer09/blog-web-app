"use client";
import React, { FC, useContext, useState } from "react";
import { Button } from "./ui/button";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { TopicFollowSchema, cachedTopic } from "@/type/topic";
import axios, { AxiosError } from "axios";
import { ZodError } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "./ui/use-toast";

interface TopicFollowButtonProps {
  topic: cachedTopic & { isFollowed: boolean };
  setTopic: (topic: cachedTopic & { isFollowed: boolean }) => void;
}

const TopicFollowButton: FC<TopicFollowButtonProps> = ({ topic, setTopic }) => {
  const router = useRouter();
  const queryClient = new QueryClient();

  const { mutate: follow, isPending: followPending } = useMutation({
    mutationKey: ["follow"],
    mutationFn: (id: string) => {
      const payload = TopicFollowSchema.parse(id);
      return axios.post("/api/topic/follow", { payload });
    },
    onMutate: () => {
      setTopic({
        ...topic,
        blogs: topic.blogs,
        followers: (parseInt(topic.followers)+ 1).toString(),
        isFollowed: !topic.isFollowed,
      });
    },
    onError: (err) => {
      setTopic({
        ...topic,
        blogs: topic.blogs,
        followers: (parseInt(topic.followers)- 1).toString(),
        isFollowed: !topic.isFollowed,
      });
      if (err instanceof ZodError || err instanceof AxiosError) {
        toast({
          title: "Incorrect Data",
          description: err.message,
          variant: "destructive",
        });
      }
    },
  });

  const { mutate: unfollow, isPending: unfollowPending } = useMutation({
    mutationKey: ["follow"],
    mutationFn: (id: string) => {
      const payload = TopicFollowSchema.parse(id);
      return axios.post("/api/topic/unfollow", { payload });
    },
    onMutate: () => {
      setTopic({
        ...topic,
        blogs: topic.blogs,
        followers: (parseInt(topic.followers)- 1).toString(),
        isFollowed: !topic.isFollowed,
      });
    },
    onError: (err) => {
      setTopic({
        ...topic,
        blogs: topic.blogs,
        followers: (parseInt(topic.followers)+ 1).toString(),
        isFollowed: !topic.isFollowed,
      });
      if (err instanceof ZodError || err instanceof AxiosError) {
        toast({
          title: "Incorrect Data",
          description: err.message,
          variant: "destructive",
        });
      }
      
    },
  });
  return (
    <Button
      variant={topic.isFollowed ? "outline" : "default"}
      onClick={
        topic.isFollowed ? () => unfollow(topic.name) : () => follow(topic.name)
      }
      disabled={followPending || unfollowPending ? true : false}
    >
      {topic.isFollowed ? "Following" : "Follow"}
    </Button>
  );
};

export default TopicFollowButton;
