"use client";
import { handleClientError } from "@/lib/error";
import { TopicFollowSchema, cachedTopic } from "@/type/topic";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { FC } from "react";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import { useRouter } from "next/navigation";

interface TopicFollowButtonProps {
  topic: cachedTopic & { isFollowed: boolean };
  setTopic: (topic: cachedTopic & { isFollowed: boolean }) => void;
}

const TopicFollowButton: FC<TopicFollowButtonProps> = ({ topic, setTopic }) => {
  const router = useRouter();
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
        followers: topic.followers + 1,
        isFollowed: !topic.isFollowed,
      });
    },
    onError: (err) => {
      setTopic({
        ...topic,
        blogs: topic.blogs,
        followers: topic.followers - 1,
        isFollowed: !topic.isFollowed,
      });
      handleClientError(err);
    },
    onSuccess: () => {
      toast({
        description: "Topic followed Successfully",
      })
      router.refresh();
    }
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
        followers: topic.followers - 1,
        isFollowed: !topic.isFollowed,
      });
    },
    onError: (err) => {
      setTopic({
        ...topic,
        blogs: topic.blogs,
        followers: topic.followers + 1,
        isFollowed: !topic.isFollowed,
      });
      handleClientError(err);
    },
    onSuccess: () => {
      toast({
        description: "Topic unfollowed Successfully",
      })
      router.refresh();
    }
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
