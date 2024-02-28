import { UserDetails, cachedUser } from "@/type/user";
import React, { FC } from "react";
import UserSelect from "./UserSelect";
import { auth, clerkClient } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";

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
          return <UserSelect key={key} followObj={followObj} />;
        })}
      </ScrollArea>
    </div>
  );
};

export default UserFollowList;
