import TopicFollow from "@/components/follows/TopicFollow";
import UserFollow from "@/components/follows/UserFollow";
import { getUnfollowedTopics, getUnfollowedUsers } from "@/lib/user";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
const page = async () => {
  const { userId } = auth();
  if(!userId) return redirect('/sign-in');
  const unfollowedTopic = await getUnfollowedTopics(userId, 1);
  const unfollowedUsers = await getUnfollowedUsers(userId, 7);
  return (
    <div>
      <TopicFollow title="Topics" data={unfollowedTopic} followed={false} />
      <UserFollow title="Users" data={unfollowedUsers} followed={false} />
    </div>
  );
};

export default page;
