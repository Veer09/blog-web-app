import { PastComments } from "@/type/comment";
import React, { FC } from "react";
import CommentSection from "./CommentSection";

interface ShowPastCommentProps {
  pastComments: PastComments[] | undefined;
}

const ShowPastComment: FC<ShowPastCommentProps> = ({ pastComments }) => {
  return (
    <div>
      {pastComments
        ? pastComments.map((comment) => {
            return (
                  <CommentSection comment={comment} />
            );
          })
        : null}
    </div>
  );
};

export default ShowPastComment;
