import ItemFollow from "@/components/follows/ItemFollow";
import { getUnfollowedTopics, getUnfollowedUsers } from "@/lib/user";
const page = async () => {
  const unfollowedTopic = await getUnfollowedTopics(7);
  const unfollowedUsers = await getUnfollowedUsers(7);
  return (
    <div>
      <ItemFollow title="Topics" data={unfollowedTopic} followed={false} />
      <ItemFollow title="Users" data={unfollowedUsers} followed={false} />
    </div>
  );
};

export default page;
