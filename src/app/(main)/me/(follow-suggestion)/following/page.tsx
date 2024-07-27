import TopicFollow from "@/components/follows/TopicFollow";
import UserFollow from "@/components/follows/UserFollow";
import { getUserFollowings, getUserTopics } from "@/lib/user";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { FC } from "react";

const page: FC = async () => {
  const { userId } = auth();
  if(!userId) return redirect('/sign-in');
  const followedTopics = await getUserTopics(userId, 7);
  const following = await getUserFollowings(userId, 7);
  return (
    <div className=" my-10">
      <TopicFollow title="Topic's you follow" data={followedTopics} followed={true}/>
      <UserFollow title="User's you follow" data={following} followed={true}/>
    </div>
  );
};

export default page;
