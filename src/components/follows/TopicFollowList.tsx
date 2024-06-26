import { ScrollArea } from "@/components/ui/scroll-area";
import { cachedTopic } from "@/type/topic";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { FC } from "react";
import ItemSelect from "./ItemSelect";

interface TopicFollowListProps {
  topics: cachedTopic[];
  isFollowed: boolean;
}

const TopicFollowList: FC<TopicFollowListProps> = ({ topics, isFollowed}) => {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }
  return (
    <div>
      <ScrollArea className=" h-[80vh]">
        {topics.map((topic, key) => {
          const followObj = {
            ...topic,
            isFollowed,
          };
          return <ItemSelect key={key} followObj={followObj} />;
        })}
      </ScrollArea>
    </div>
  );
};

export default TopicFollowList;
