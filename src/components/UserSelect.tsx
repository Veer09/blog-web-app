"use client";
import { cachedUser } from "@/type/user";
import React, { FC, useState } from "react";
import UserFollowButton from "./UserFollowButton";

interface UserSelectProps {
  followObj: cachedUser & { isFollowed: boolean; name: string };
}
const UserSelect: FC<UserSelectProps> = ({ followObj }) => {
  const [user, setUser] = useState(followObj);
  // if (!followObj) return <></>;
  return (
    <div className=" flex items-center p-3 justify-between">
      <div>
        <p className=" font-bold text-lg">{followObj.name}</p>
        <p className=" text-slate-600">
          Followers: {user.followers} | Blogs: {user.blogs}{" "}
        </p>
      </div>
      <div>
        <UserFollowButton user={user} setUser={setUser} />
      </div>
    </div>
  );
};

export default UserSelect;
