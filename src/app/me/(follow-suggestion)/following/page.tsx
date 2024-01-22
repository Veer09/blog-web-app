import FollowContainer from "@/components/general/topic/TopicFollowContainer";
import TopicFollow from "@/components/general/topic/TopicFollow";
import { getUserTopicCount, getUserWithCounts } from "@/lib/user";
import React, { FC } from "react";
import TopicFollowContainer from "@/components/general/topic/TopicFollowContainer";
import UserFollowContainer from "@/components/general/user/UserFollowContainer";

const page: FC = async () => {
  const topics = await getUserTopicCount();
  const users = await getUserWithCounts();

  return (
    <div>
      {topics ? <TopicFollowContainer topics={topics} /> : <></>}
      {users ? <UserFollowContainer users={users} /> : <></>}
    </div>
  );
};

export default page;
