import { BookmarkPlus, Heart } from "lucide-react";
import React, { FC } from "react";
import CommentSheet from "./CommentSheet";
import { Comment } from "@prisma/client";
interface UserInteractionProps {
  blogId: string;

}
const UserInteraction: FC<UserInteractionProps> = ({ blogId }) => {
  return (
    <>
      <Heart className=" cursor-pointer" />
      <CommentSheet blogId={blogId}/>
      <BookmarkPlus className=" cursor-pointer" />
    </>
  );
};

export default UserInteraction;
