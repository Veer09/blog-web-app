"use client"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { FC } from "react";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { usePathname } from "next/navigation";
import { cachedTopic } from "@/type/topic";


interface TopicSliderProps {
    topics: cachedTopic[]; 
}

const TopicSlider: FC<TopicSliderProps> = ({ topics }) => {
  const pathname = usePathname();
  const currentTopic = decodeURI(pathname.split("/")[3]);
  const currentSection = pathname.split("/")[4];
  if (!topics) return;
  return (
    <ScrollArea className=" w-[70%]">
      <Tabs value={currentTopic} >
        <TabsList>
          <TabsTrigger value="add">
            <Link href="/me/suggestions">
              <PlusIcon />
            </Link>
          </TabsTrigger>
          {topics.map((topic, key) => {
            return (
              <TabsTrigger value={topic.name} key={key}>
                <Link href={`/dashboard/topic/${topic.name}/${currentSection ? currentSection : 'blogs'}`}>{topic.name}</Link>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
      <ScrollBar orientation="horizontal" className=" hidden"/>
    </ScrollArea>
  );
};

export default TopicSlider;
