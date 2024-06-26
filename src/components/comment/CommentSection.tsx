import {
  CommentData,
  commentDeleteSchema,
  replayCommentSchema,
} from "@/type/comment";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { toast } from "../ui/use-toast";
import ShowPastComment from "./ShowPastComment";

interface CommentProps {
  comment: CommentData
  allComments: CommentData[];
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
        blogId: comment.blog_id,
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
          <Image
            src={comment.user.imageUrl}
            width={24}
            height={24}
            className="rounded-[50%]"
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
