import {
  PastComments,
  commentDeleteSchema,
  commentGetResponseSchema,
  replayCommentSchema,
  repliesGetSchema,
} from "@/type/comment";
import { auth, clerkClient, useUser } from "@clerk/nextjs";
import { Comment } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { FC, useState } from "react";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import { Textarea } from "../ui/textarea";
import ShowPastComment from "./ShowPastComment";

interface CommentProps {
  comment: PastComments;
}

const CommentSection: FC<CommentProps> = ({ comment }) => {
  const { user } = useUser();
  const [reply, setReply] = useState<string>("");
  const [show, setShow] = useState<boolean>(false);
  const [showReply, setShowReply] = useState<boolean>(false);
  const [pastReplies, setPastReplies] = useState<PastComments[] | undefined>()
  const { mutate: deleteComment } = useMutation({
    mutationFn: () => {
      const payloadObj = {
        comment: comment.comment.id,
        userId: comment.user.id,
      };
      const payload = commentDeleteSchema.parse(payloadObj);
      return axios.post("/api/comment/delete", { payload });
    },
    onError: (err) => {
      toast({
        variant: "destructive",
        title: err.message,
      });
    },
  });

  const { mutate: replyComment } = useMutation({
    mutationFn: () => {
      const payloadObj = {
        comment: reply,
        commentId: comment.comment.id,
        blogId: comment.comment.blog_id,
      };
      const payload = replayCommentSchema.parse(payloadObj);
      return axios.post("/api/comment/reply", payload);
    },

    onError: (error) => {
      toast({
        variant: 'destructive',
        title: error.message
      })
    }
  });

  const { mutate: getReplies } = useMutation({
    mutationFn: () => {
      const commentId  = repliesGetSchema.parse(comment.comment.id);
      return axios.post('/api/comment/getReplies', { commentId })
    },
    onSuccess: (response) => {
      setShowReply(!showReply);
      const res = commentGetResponseSchema.safeParse(response.data);
      if(!res.success) return ;
      setPastReplies(res.data);
    },
    onError: (error) => {
      console.log(error);
      toast({
        variant: 'destructive',
        title: error.message
      })
    }
  })
  if (!user) return;
  return (
    <div>
      <div className=" flex justify-between items-center">
        <div className=" flex gap-4 my-4 items-center">
          <img
            src={comment.user.imageUrl}
            className=" w-6 h-6 rounded-[50%]"
            alt=""
          />
          <div>
            <p className=" text-lg font-semibold">
              {comment.user.firstName} {comment.user.lastName}
            </p>
            <p>{comment.comment.content}</p>
          </div>
        </div>
        <div>
          {user?.id === comment.user.id ? (
            <Button onClick={() => deleteComment()}>Delete</Button>
          ) : (
            <Button onClick={() => setShow(!show)}>Reply</Button>
          )}
        </div>
      </div>
      <div>
        {comment.comment._count.replies != 0 ? (
          (!showReply) ? 
          <Button variant="link" onClick={() => getReplies()}>{comment.comment._count.replies + " Replies"}</Button>
          : 
          <div>
            <Button variant="link" onClick={() => setShowReply(!showReply)}>Hide Replies</Button>
            <ShowPastComment pastComments={pastReplies}/>            
          </div>
        ) : null}
      </div>
      {show ? (
        <div>
          <Textarea
            placeholder="Write comment here"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          />
          <Button className=" my-3" onClick={() => replyComment()}>
            Submit
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default CommentSection;
