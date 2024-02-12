import {
  commentDeleteSchema,
  replayCommentSchema,

} from "@/type/comment";
import { useUser } from "@clerk/nextjs";
import { useMutation} from "@tanstack/react-query";
import axios from "axios";
import React, { FC, useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";
import { Textarea } from "./ui/textarea";
import ShowPastComment from "./ShowPastComment";
import { Comment } from "@prisma/client";
import { User } from "@clerk/nextjs/server";
import { useRouter } from "next/navigation";

interface CommentProps {
  comment: Comment & {user: {firstName: string | null, lastName: string | null, imageUrl: string}};
  allComments: Array<Comment & {user: {firstName: string | null, lastName: string | null, imageUrl: string}}>;
}

const CommentSection: FC<CommentProps> = ({ comment, allComments }) => {
  const { user } = useUser();
  const router = useRouter();
  const [reply, setReply] = useState<string>("");
  const [show, setShow] = useState<boolean>(false);
  const [showReply, setShowReply] = useState<boolean>(false);
  const replies = allComments.filter(comm => comm.reply_id === comment.id)

  const { mutate: deleteComment } = useMutation({
    mutationFn: () => {
      const payloadObj = {
        comment: comment.id,
        userId: comment.user_id,
      };
      const payload = commentDeleteSchema.parse(payloadObj);
      return axios.post("/api/comment/delete", { payload });
    },
    onSuccess: () => {
      router.refresh();
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
        commentId: comment.id,
        blogId: comment.blog_id,
      };
      const payload = replayCommentSchema.parse(payloadObj);
      return axios.post("/api/comment/reply", payload);
    },
    onSuccess: () => {
      router.refresh();
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: error.message
      })
    }
  });

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
            <p>{comment.content}</p>
          </div>
        </div>
        <div>
          {user?.id === comment.user_id ? (
            <Button onClick={() => deleteComment()}>Delete</Button>
          ) : (
            <Button onClick={() => setShow(!show)}>{(show) ? "Close" : "Reply"}</Button>
          )}
        </div>
      </div>
      <div>
        {replies.length != 0 ? (
          (!showReply) ? 
          <Button variant="link" onClick={() => setShowReply(!showReply)}>{replies.length + " Replies"}</Button>
          : 
          <div>
            <Button variant="link" onClick={() => setShowReply(!showReply)}>Hide Replies</Button>
            <ShowPastComment pastComments={allComments} baseComment={comment} />            
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
