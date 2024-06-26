"use client";
import { toast } from "@/components/ui/use-toast";
import { savedBySchema } from "@/type/user";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { BookCheck, BookmarkPlus, Heart } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { FC, useState } from "react";
import CommentSheet from "../comment/CommentSheet";
import { useUser } from "@clerk/nextjs";

interface UserInteractionProps {
  blogId: string;
  saved: boolean;
  liked: boolean;
  likes: number;
}
const UserInteraction: FC<UserInteractionProps> = ({
  blogId,
  saved,
  liked,
  likes,
}) => {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const [isSaved, setIsSaved] = useState(saved);
  const [like, setLike] = useState({ liked, likes });
  const { mutate: saveBlog } = useMutation({
    mutationFn: () => {
      const payload = savedBySchema.parse(blogId);
      return axios.post("/api/blog/save", { payload });
    },
    onMutate: () => {
      setIsSaved(true);
    },
    onError: (err) => {
      toast({
        variant: "destructive",
        title: err.message,
      });
    },
  });
  const { mutate: unSaveBlog } = useMutation({
    mutationFn: () => {
      const payload = savedBySchema.parse(blogId);
      return axios.post("/api/blog/unsave", { payload });
    },
    onMutate: () => {
      setIsSaved(false);
    },
    onError: (err) => {
      toast({
        variant: "destructive",
        title: err.message,
      });
    },
  });

  const { mutate: likeBlog } = useMutation({
    mutationFn: () => {
      const payload = savedBySchema.parse(blogId);
      return axios.post("/api/blog/like", { payload });
    },
    onMutate: () => {
      setLike({
        liked: true,
        likes: like.likes + 1,
      });
    },
    onError: (err) => {
      toast({
        variant: "destructive",
        title: err.message,
      });
    },
  });
  const { mutate: unlikeBlog } = useMutation({
    mutationFn: () => {
      const payload = savedBySchema.parse(blogId);
      return axios.post("/api/blog/unlike", { payload });
    },
    onMutate: () => {
      setLike({
        liked: false,
        likes: like.likes - 1,
      });
    },
    onError: (err) => {
      toast({
        variant: "destructive",
        title: err.message,
      });
    },
  });

  return (
    <>
      {!like.liked ? (
        <Heart
          className=" cursor-pointer"
          onClick={() => {
            if (!isSignedIn) return router.push("/sign-in");
            likeBlog();
          }}
        />
      ) : (
        <Heart
          fill="red"
          className=" cursor-pointer"
          onClick={() => {
            if (!isSignedIn) return router.push("/sign-in");
            unlikeBlog();
          }}
        />
      )}{" "}
      {like.likes}
      <CommentSheet blogId={blogId} />
      {isSaved ? (
        <BookCheck
          className=" cursor-pointer"
          onClick={() => {
            if (!isSignedIn) return router.push("/sign-in");
            unSaveBlog();
          }}
        />
      ) : (
        <BookmarkPlus
          className=" cursor-pointer"
          onClick={() => {
            if (!isSignedIn) return router.push("/sign-in");
            saveBlog();
          }}
        />
      )}
    </>
  );
};

export default UserInteraction;
