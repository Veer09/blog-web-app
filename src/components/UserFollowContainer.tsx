import { UserDetails } from "@/type/user";
import { auth, clerkClient } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React, { FC } from "react";
import UserSelect from "./UserSelect";


interface UserFollowContainerProps {
  users: UserDetails[];
  isFollowed: boolean;
}

const UserFollowContainer: FC<UserFollowContainerProps> = async ({
  users,
  isFollowed,
}) => {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }
  const clerkData = users.map(async (user, key) => {
    return await clerkClient.users.getUser(user.id);
  });
  const data = await Promise.all(clerkData);
  return (
    <div>
      {users.map((user, key) => {
        const followObj = {
          ...user,
          name:
            (data[key].firstName ? data[key].firstName : "") +
            " " +
            (data[key].lastName ? data[key].lastName : ""),
          isFollowed,
        };
        return <UserSelect key={key} followObj={followObj} />;
      })}
    </div>
  );
};

export default UserFollowContainer;
