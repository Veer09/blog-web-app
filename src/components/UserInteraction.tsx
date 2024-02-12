"use client"
import { BookCheck, BookmarkPlus, Heart } from "lucide-react";
import React, { FC } from "react";
import CommentSheet from "./CommentSheet";
import { useMutation } from "@tanstack/react-query";
import { savedBySchema } from "@/type/user";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { Comment } from "@prisma/client";
import { User } from "@clerk/nextjs/server";
import { useRouter } from "next/navigation";

interface UserInteractionProps {
  blogId: string;
  saved: boolean;
  comments: Array<Comment & {user: {firstName: string | null, lastName: string | null, imageUrl: string}}>;
}
const UserInteraction: FC<UserInteractionProps> = ({ blogId, saved, comments }) => {
  const router = useRouter();
  const { mutate: saveBlog } = useMutation({
    mutationFn: () => {
      const payload = savedBySchema.parse(blogId);
      return axios.post('/api/blog/save', { payload })
    },
    onSuccess: () => {
      toast({
        title: "Blog saved successfully!!"
      })
      router.refresh();
    },
    onError: (err) => {
      toast({
        variant: "destructive",
        title: err.message
      })
    }
  })
  const { mutate: unSaveBlog } = useMutation({
    mutationFn: () => {
      const payload = savedBySchema.parse(blogId);
      return axios.post('/api/blog/unsave', { payload })
    },
    onSuccess: () => {
      toast({
        title: "Blog unsaved successfully!!"
      })
    },
    onError: (err) => {
      toast({
        variant: "destructive",
        title: err.message
      })
    }
  })
  return (
    <>
      <Heart className=" cursor-pointer" />
      <CommentSheet comments={comments} blogId={blogId}/>
      {(saved) ? <BookCheck className=" cursor-pointer" onClick={() => unSaveBlog()}/> : <BookmarkPlus className=" cursor-pointer" onClick={() => saveBlog()}/>}
    </>
  );
};

export default UserInteraction;
