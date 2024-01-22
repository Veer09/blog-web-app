"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import {
  PastComments,
  commentGetResponseSchema,
  commentGetSchema,
  commentUploadSchema,
} from "@/type/comment";
import { Comment } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { MessagesSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { comment } from "postcss";
import React, { FC, useState } from "react";
import { ZodError } from "zod";
import Comments from "../CommentSection";
import CommentSection from "../CommentSection";
import { User } from "@clerk/nextjs/server";
import { ScrollArea } from "@/components/ui/scroll-area";
import ShowPastComment from "../ShowPastComment";

interface CommentSheetProps {
  blogId: string;
}

const CommentSheet: FC<CommentSheetProps> = ({ blogId }) => {
  const router = useRouter();
  const [comment, setComment] = useState<string>("");
  const [pastComments, setPastComments] = useState<
    undefined | PastComments[]
  >();
  const { mutate: saveComment } = useMutation({
    mutationFn: () => {
      const commentObj = {
        comment: comment,
        blogId,
      };
      const payload = commentUploadSchema.parse(commentObj);
      return axios.post("/api/comment/create", payload);
    },
    onSuccess: () => {
      setComment("");
      router.refresh();
    },
    onError: (err) => {
      if (err instanceof ZodError) {
        toast({
          title: err.message,
        });
      }
    },
  });
  const { mutate: getComments } = useMutation({
    mutationFn: () => {
      const payload = commentGetSchema.parse(blogId);
      return axios.post("/api/comment/get", { blogId });
    },
    onSuccess: (data) => {
      const response = commentGetResponseSchema.safeParse(data.data);
      if (!response.success) return;
      setPastComments(response.data);
    },
  });

  return (
    <div>
      <Sheet>
        <SheetTrigger>
          <MessagesSquare onClick={() => getComments()} />
        </SheetTrigger>
        <SheetContent className=" w-[40%] overflow-scroll">
          <SheetHeader>
            <SheetTitle>Comments:</SheetTitle>
            <SheetDescription>
              <Textarea
                placeholder="Write comment here"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <Button className=" my-3" onClick={() => saveComment()}>
                Submit
              </Button>
            </SheetDescription>
          </SheetHeader>
          <p className=" my-5 text-lg font-semibold">Past Comments: </p>
          <div>
            <ShowPastComment pastComments={pastComments}/>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CommentSheet;
