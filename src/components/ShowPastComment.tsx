import React, { FC } from "react";
import CommentSection from "./CommentSection";
import { Comment } from "@prisma/client";
import { User } from "@clerk/nextjs/server";

interface ShowPastCommentProps {
  pastComments: Array<Comment & {user: {firstName: string | null, lastName: string | null, imageUrl: string}}> | undefined;
  baseComment: Comment & {user: {firstName: string | null, lastName: string | null, imageUrl: string}}| undefined
}

const ShowPastComment: FC<ShowPastCommentProps> = ({ pastComments, baseComment }) => {

  return (
    <div>
      {pastComments
        ? pastComments.map((comment, key) => {
            console.log(comment.reply_id === ((baseComment) ? baseComment.id : null));
            return ((comment.reply_id === ((baseComment) ? baseComment.id : null)) ? (
              <CommentSection key={key} comment={comment} allComments={pastComments}/>
            ) : null);
          })
        : null}
    </div>
  );
};

export default ShowPastComment;
