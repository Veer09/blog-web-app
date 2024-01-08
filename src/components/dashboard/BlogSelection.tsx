import { getUserTopic } from "@/lib/user";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import React, { FC } from "react";
import Link from "next/link";
import { PlusIcon } from "lucide-react";

const DashboardSlider: FC = async () => {
  const topics = await getUserTopic();
  if(!topics) return;
  return (
    <Tabs defaultValue="following" className="w-[70%]">
      <TabsList>
        <TabsTrigger value="add"><Link href="/me/following"><PlusIcon/></Link></TabsTrigger>
        <TabsTrigger value="following">Following</TabsTrigger>
        {
          topics.map((topic) => {
            return <TabsTrigger value={topic.topic.name} key={topic.topic_id}><Link href="#">{topic.topic.name}</Link></TabsTrigger>
          })
        }
      </TabsList>
      <TabsContent value="account">
        Make changes to your account here.
      </TabsContent>
      <TabsContent value="password">Change your password here.</TabsContent>
    </Tabs>
  );
};

export default DashboardSlider;
