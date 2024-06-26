"use client";
import { cachedUser } from "@/type/user";
import React, { FC, useState } from "react";
import UserFollowButton from "./UserFollowButton";
import { cachedTopic } from "@/type/topic";
import TopicFollowButton from "./TopicFollowButton";


interface ItemSelectProps {
  followObj: cachedUser & { isFollowed: boolean; name: string } | cachedTopic & { isFollowed: boolean };
}

const isUser = (data: any): data is cachedUser => {
  return data.firstName !== undefined;
}

const ItemSelect: FC<ItemSelectProps> = ({ followObj }) => {
  const [item, setItem] = useState(followObj);
  return (
    <div className=" flex items-center p-3 justify-between">
      <div>
        <p className=" font-bold text-lg">{followObj.name}</p>
        <p className=" text-slate-600">
          Followers: {item.followers} | Blogs: {item.blogs}{" "}
        </p>
      </div>
      {
        isUser(item) ? <UserFollowButton user={item} setUser={setItem} />
          : <TopicFollowButton topic={item} setTopic={setItem} />
      }
    </div>
  );
};

export default ItemSelect;
