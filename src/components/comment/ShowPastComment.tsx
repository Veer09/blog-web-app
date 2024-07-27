import { CommentData } from "@/type/comment";
import { FC } from "react";
import CommentSection from "./CommentSection";

interface ShowPastCommentProps {
  pastComments: CommentData[] | undefined;
  baseComment: CommentData | undefined
}

const ShowPastComment: FC<ShowPastCommentProps> = ({ pastComments, baseComment }) => {

  return (
    <div>
      {pastComments
        ? pastComments.map((comment, key) => {
            return ((comment.reply_id === ((baseComment) ? baseComment.id : null)) ? (
              <CommentSection key={key} comment={comment} allComments={pastComments}/>
            ) : null);
          })
        : null}
    </div>
  );
};

export default ShowPastComment;
