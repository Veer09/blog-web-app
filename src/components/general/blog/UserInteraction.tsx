"use client"
import { BookCheck, BookmarkPlus, Heart } from "lucide-react";
import React, { FC } from "react";
import CommentSheet from "./CommentSheet";
import { useMutation } from "@tanstack/react-query";
import { savedBySchema } from "@/type/user";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
interface UserInteractionProps {
  blogId: string;
  saved: boolean;
}
const UserInteraction: FC<UserInteractionProps> = ({ blogId, saved }) => {
  const { mutate: saveBlog } = useMutation({
    mutationFn: () => {
      const payload = savedBySchema.parse(blogId);
      return axios.post('/api/blog/save', { payload })
    },
    onSuccess: () => {
      toast({
        title: "Blog saved successfully!!"
      })
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
      <CommentSheet blogId={blogId}/>
      {(saved) ? <BookCheck className=" cursor-pointer" onClick={() => unSaveBlog()}/> : <BookmarkPlus className=" cursor-pointer" onClick={() => saveBlog()}/>}
    </>
  );
};

export default UserInteraction;
