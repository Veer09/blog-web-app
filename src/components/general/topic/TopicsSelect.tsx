'use client'
import React, { FC, useContext } from "react";
import FollowButton from "../FollowButton";
import { FollowContext } from "../../provider/ContextProvider";

const TopicsSelect: FC = () => {
  const follow = useContext(FollowContext);
  if (!follow) return null;
  const topic = follow.state;
  return (
    <div className=" flex items-center p-3 justify-between">
      <div>
        <p className=" font-bold text-lg">{topic.name}</p>
        <p className=" text-slate-600">
          Followers: {topic._count.users} | Blogs: {topic._count.blogs}{" "}
        </p>
      </div>
      <FollowButton />
    </div>
  );
};

export default TopicsSelect;
