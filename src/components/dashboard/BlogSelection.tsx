import { getUserTopic } from "@/lib/user";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { FC } from "react";
import Link from "next/link";
import { PlusIcon } from "lucide-react";

const DashboardSlider: FC = async () => {
  const topics = await getUserTopic();
  if (!topics) return;
  return (
    <Tabs defaultValue="following" className="w-[70%]">
      <TabsList>
        <TabsTrigger value="add">
          <Link href="/me/suggestions">
            <PlusIcon />
          </Link>
        </TabsTrigger>
        <TabsTrigger value="following">
          <Link href='/dashboard/following'>Following</Link>
        </TabsTrigger>
        {topics.topics.map((topic) => {
          return (
            <TabsTrigger value={topic.name} key={topic.id}>
              <Link href={`/dashboard/${topic.name}`}>{topic.name}</Link>
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
};

export default DashboardSlider;
