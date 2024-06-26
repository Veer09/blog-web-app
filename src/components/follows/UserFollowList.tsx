import { ScrollArea } from "@/components/ui/scroll-area";
import { cachedUser } from "@/type/user";
import { auth, clerkClient } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { FC } from "react";
import ItemSelect from "./ItemSelect";

interface UserFollowListProps {
  users: cachedUser[];
  isFollowed: boolean;
}

const UserFollowList: FC<UserFollowListProps> = ({ users, isFollowed}) => {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }
  return (
    <div>
      <ScrollArea className=" h-[80vh]">
        {users.map(async (user, key) => {
          const clerkData = await clerkClient.users.getUser(user.id);
          const followObj = {
            ...user,
            name: clerkData.firstName + " " + clerkData.lastName,
            isFollowed,
          };
          return <ItemSelect key={key} followObj={followObj} />;
        })}
      </ScrollArea>
    </div>
  );
};

export default UserFollowList;
