import React, { FC } from "react";
import TopicFollow from "@/components/TopicFollow";
import { unstable_noStore } from "next/cache";
import UserFollow from "@/components/UserFollow";
import { getUserFollowings, getUserTopics } from "@/lib/user";

const page: FC = async () => {
  const followedTopics = await getUserTopics(7);
  const following = await getUserFollowings(7);
  return (
    <div className=" my-10">
      <TopicFollow title="Topics you follow" topics={followedTopics} followed={true}/>
      <UserFollow title="People you follow" users={following} followed={true}/>
    </div>
  );
};

export default page;
