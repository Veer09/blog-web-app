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
  commentUploadSchema,
} from "@/type/comment";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { MessagesSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { FC, useState } from "react";
import { ZodError } from "zod";
import ShowPastComment from "./ShowPastComment";
import { Comment } from "@prisma/client";

interface CommentSheetProps {
  comments: Array<Comment & {user: {firstName: string | null, lastName: string | null, imageUrl: string}}>,
  blogId: string
}

const CommentSheet: FC<CommentSheetProps> = ({ comments, blogId }) => {
  const router = useRouter();
  const [comment, setComment] = useState<string>("");

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

  return (
    <div>
      <Sheet>
        <SheetTrigger>
          <MessagesSquare/>
        </SheetTrigger>
        <SheetContent className="overflow-scroll">
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
            <ShowPastComment pastComments={comments} baseComment={undefined}/>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CommentSheet;
