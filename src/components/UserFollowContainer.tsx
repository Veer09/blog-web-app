import { UserDetails, cachedUser } from "@/type/user";
import { auth, clerkClient } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React, { FC } from "react";
import UserSelect from "./UserSelect";
import { redis } from "@/lib/redis";
import { User } from "@clerk/nextjs/server";

interface UserFollowContainerProps {
  users: cachedUser[];
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
  return (
    <div>
      {users.map((user, key) => {
        const followObj = {
          ...user,
          name:
            (user.firstName ? user.firstName : "") +
            " " +
            (user.lastName ? user.lastName : ""),
          isFollowed,
        };
        return <UserSelect key={key} followObj={followObj} />;
      })}
    </div>
  );
};

export default UserFollowContainer;
