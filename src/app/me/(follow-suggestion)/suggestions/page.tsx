import FollowContainer from "@/components/general/topic/TopicFollowContainer";
import { getAllTopic } from "@/lib/topic";
import { getUnfollowedTopics } from "@/lib/user";
import React from "react";

const page = async () => {
  const unfollowedTopic = await getUnfollowedTopics();
  if(!unfollowedTopic) return;
  return (
    <div>
      <FollowContainer topics={unfollowedTopic} />
    </div>
  );
};

export default page;
