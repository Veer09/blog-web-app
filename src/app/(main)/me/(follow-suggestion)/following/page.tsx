import ItemFollow from "@/components/follows/ItemFollow";
import { getUserFollowings, getUserTopics } from "@/lib/user";
import { FC } from "react";

const page: FC = async () => {
  const followedTopics = await getUserTopics(7);
  const following = await getUserFollowings(7);
  return (
    <div className=" my-10">
      <ItemFollow title="Topics you follow" data={followedTopics} followed={true}/>
      <ItemFollow title="People you follow" data={following} followed={true}/>
    </div>
  );
};

export default page;
