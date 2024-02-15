"use client"
import { BookCheck, BookmarkPlus, Heart } from "lucide-react";
import React, { FC, useState } from "react";
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
  liked: boolean;
  likes: number;
}
const UserInteraction: FC<UserInteractionProps> = ({ blogId, saved, comments, liked, likes }) => {
  const router = useRouter();
  const [like, setLike] = useState({
    likes: likes,
    liked: liked
  })
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
      router.refresh();
    },
    onError: (err) => {
      toast({
        variant: "destructive",
        title: err.message
      })
    }
  })

  const {mutate: likeBlog} = useMutation({
    mutationFn: () => {
      const payload = savedBySchema.parse(blogId);
      return axios.post('/api/blog/like', { payload })
    },
    onMutate: () => {
      setLike({
        likes: likes + 1,
        liked: true
      })
    },    
    onSuccess: () => {
      toast({
        title: "Blog liked successfully!!"
      })
    },
    onError: (err) => {
      toast({
        variant: "destructive",
        title: err.message
      })
    }
  });
  const {mutate: unlikeBlog} = useMutation({
    mutationFn: () => {
      const payload = savedBySchema.parse(blogId);
      return axios.post('/api/blog/unlike', { payload })
    },
    onMutate: () => {
      setLike({
        likes: likes,
        liked: false
      })
    }, 
    onSuccess: () => {
      toast({
        title: "Blog unliked successfully!!"
      })
    },
    onError: (err) => {
      toast({
        variant: "destructive",
        title: err.message
      })
    }
  });

  return (
    <>
      {((!like.liked) ? <Heart className=" cursor-pointer" onClick={() => likeBlog()}/> : <Heart fill="red" className=" cursor-pointer" onClick={() => unlikeBlog()}/>)} {like.likes}
      <CommentSheet comments={comments} blogId={blogId}/>
      {(saved) ? <BookCheck className=" cursor-pointer" onClick={() => unSaveBlog()}/> : <BookmarkPlus className=" cursor-pointer" onClick={() => saveBlog()}/>}
    </>
  );
};

export default UserInteraction;
