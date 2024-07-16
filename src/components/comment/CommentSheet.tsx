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
  CommentData,
  commentUploadSchema,
} from "@/type/comment";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { MessagesSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { ZodError } from "zod";
import ShowPastComment from "./ShowPastComment";
import { useUser } from "@clerk/nextjs";
import { handleClientError } from "@/lib/error";

interface CommentSheetProps {
  blogId: string
}

const CommentSheet: FC<CommentSheetProps> = ({ blogId }) => {
  const router = useRouter();
  const [comment, setComment] = useState<string>("");
  const [comments, setComments] = useState<CommentData[]>([]);
  const { isSignedIn } = useUser();
  const { mutate: saveComment } = useMutation({
    mutationFn: () => {
      const commentObj = {
        comment: comment,
        blogId,
      };
      const payload = commentUploadSchema.parse(commentObj);
      return axios.post("/api/comment/create", payload);
    },
    onSuccess: async () => {
      setComment("");
    },
    onError: (err) => {
      handleClientError(err);
    },
  });

  const showComment = async () => {
    const res = await axios.get(`/api/blog/${blogId}/comments`);
    setComments(res.data.comments);
  }
     


  return (
    <div>
      <Sheet>
        <SheetTrigger>
          <MessagesSquare onClick={showComment}/>
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
              <Button className=" my-3" onClick={() => {
                if(!isSignedIn) return router.push("/sign-in")
                saveComment()
              }}>
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
