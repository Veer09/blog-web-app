"use client"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { FC } from "react";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { usePathname } from "next/navigation";


interface TopicSliderProps {
    topics: {
      id: string;
      name: string;
    }[] | null 
}

const TopicSlider: FC<TopicSliderProps> = ({ topics }) => {
  const pathname = usePathname();
  const currentTopic = decodeURI(pathname.split("/")[2]);
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
          <TabsTrigger value="following">
            <Link href="/dashboard/following">Following</Link>
          </TabsTrigger>
          {topics.map((topic) => {
            return (
              <TabsTrigger value={topic.name} key={topic.id}>
                <Link href={`/dashboard/${topic.name}`}>{topic.name}</Link>
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
