import { TopicWithCount } from "@/lib/topic";
import React, { FC } from "react";
import ContextProvider from "../../provider/ContextProvider";
import TopicsSelect from "./TopicsSelect";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface FollowContainerProps {
  topics: TopicWithCount[];
}

const FollowContainer: FC<FollowContainerProps> = ({topics}) => {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }  
  return (
    <div>
      {topics.map((topic, key) => {
          const followObj = {
            ...topic,
            isFollowed:
              topic.users.filter((user) => user.id === userId).length !==
              0,
          };
          return (
            <ContextProvider followObj={followObj} key={key}>
              <TopicsSelect key={key} />
            </ContextProvider>
          );
        })}
    </div>
  )
}

export default FollowContainer;
