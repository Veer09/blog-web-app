'use client'
import React, { FC, useState } from "react";
import TopicFollowButton from "./TopicFollowButton";
import { cachedTopic } from "@/type/topic";


interface TopoicSelectProps{
  followObj: cachedTopic & { isFollowed: boolean}
}

const TopicsSelect: FC<TopoicSelectProps> = ({ followObj }) => {
  const [topic, setTopic] = useState(followObj);
  if (!followObj) return null;
  return (
    <div className=" flex items-center p-3 justify-between">
      <div>
        <p className=" font-bold text-lg">{followObj.name}</p>
        <p className=" text-slate-600">
          Followers: {topic.followers} | Blogs: {topic.blogs}{" "}
        </p>
      </div>
      <TopicFollowButton topic = {topic} setTopic = {setTopic}/>
    </div>
  );
};

export default TopicsSelect;
