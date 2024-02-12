import { getUnfollowedTopics, getUnfollowedUsers } from "@/lib/user";
import React from "react";
import TopicFollow from "@/components/TopicFollow";
import { unstable_noStore } from "next/cache";
import UserFollow from "@/components/UserFollow";
const page = async () => {
  unstable_noStore();
  const unfollowedTopic = await getUnfollowedTopics(7);
  const unfollowedUsers = await getUnfollowedUsers(7);
  return (
    <div>
      <TopicFollow
        title="Topics to Follow"
        topics={unfollowedTopic}
        followed={false}
      />
      <UserFollow
        title="Users to Follow"
        users={unfollowedUsers}
        followed={false}
      />
    </div>
  );
};

export default page;
