"use client";
import { handleClientError } from "@/lib/error";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { FC } from "react";
import { Button } from "../ui/button";

interface BookFollowButtonProps {
  isFollowed: boolean;
  bookId: string;
}

const BookFollowButton: FC<BookFollowButtonProps> = ({
  isFollowed,
  bookId,
}) => {
  const { mutate: follow, isPending: followPending } = useMutation({
    mutationKey: ["follow"],
    mutationFn: () => {
      return axios.post(`/api/topic/${bookId}/follows`);
    },
    onError: (err) => {
      handleClientError(err);
    },
  });

  const { mutate: unfollow, isPending: unfollowPending } = useMutation({
    mutationKey: ["unfollow"],
    mutationFn: () => {
      return axios.post(`/api/topic/${bookId}/unfollows`);
    },
    onError: (err) => {
      handleClientError(err);
    },
  });

  return (
    <Button
      variant={isFollowed ? "outline" : "default"}
      onClick={isFollowed ? () => unfollow() : () => follow()}
      disabled={followPending || unfollowPending ? true : false}
    >
      {isFollowed ? "Following" : "Follow"}
    </Button>
  );
};

export default BookFollowButton;
