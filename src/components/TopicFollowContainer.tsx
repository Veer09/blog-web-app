import { TopicDetails } from "@/type/topic";
import React, { FC } from "react";
import TopicsSelect from "./TopicsSelect";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TopicFollowContainerProps {
  topics: TopicDetails[];
  isFollowed: boolean;
}

const TopicFollowContainer: FC<TopicFollowContainerProps> = ({
  topics,
  isFollowed,
}) => {
  const { userId} = auth();
  if (!userId) {
    redirect("/sign-in");
  }
  
  return (
    <div>
        {topics.map((topic, key) => {
          const followObj = {
            ...topic,
            isFollowed,
          };
          return <TopicsSelect key={key} followObj={followObj} />;
        })}
        
    </div>
  );
};

export default TopicFollowContainer;
