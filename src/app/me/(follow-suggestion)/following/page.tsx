import { getUserFollowingDetails, getUserTopicDetail } from "@/lib/user";
import React, { FC } from "react";
import TopicFollow from "@/components/TopicFollow";
import { unstable_noStore } from "next/cache";
import UserFollow from "@/components/UserFollow";

const page: FC = async () => {
  unstable_noStore();
  const followedTopics = await getUserTopicDetail(7);
  const following = await getUserFollowingDetails(7);
  
  return (
    <div className=" my-10">
      <TopicFollow title="Topics you follow" topics={followedTopics} followed={true}/>
      <UserFollow title="People you follow" users={following} followed={true}/>
    </div>
  );
};

export default page;
