"use client";
import React, { FC, useContext } from "react";
import { Button } from "./ui/button";
import { FollowContext } from "./ContextProvider";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { TopicFollowSchema } from "@/type/topic";
import axios from "axios";
import { ZodError } from "zod";
import { useRouter } from "next/navigation";

const FollowButton: FC = () => {
  const topic = useContext(FollowContext);
  if (!topic) return null;
  const state = topic.state;
  const setState = topic.setState;
  const router = useRouter();
  const queryClient = new QueryClient()
  const { mutate: follow, isPending: followPending } = useMutation({
    mutationKey: ['follow'],
    mutationFn: (id: string) => {
      const payload = TopicFollowSchema.parse(id);
      return axios.post("/api/topic/follow", {payload});
    },
    onMutate: () => {
      setState({
        ...state,
        isFollowed: true,
      });
    },
    onError: (err) => {
        if(err instanceof ZodError){
            console.log(err.message);
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

      setState({
        ...state,
        isFollowed: false
      })
    },
    onError: (err) => {
      if(err instanceof ZodError){
        console.log(err.message)
      }
      router.refresh()
    }

  })
  return (
    <Button
      variant={state.isFollowed ? "outline" : "default"}
      onClick={(state.isFollowed) ? () => unfollow(state.id) : () => follow(state.id) }
      disabled={(followPending || unfollowPending) ? true : false}
    >
      {state.isFollowed ? "Following" : "Follow"}
    </Button>
  );
};

export default FollowButton;
