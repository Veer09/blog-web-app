import TopicFollow from "@/components/general/topic/TopicFollow";
import OnLogin from "@/components/general/topic/TopicFollow";
import { getAllTopic } from "@/lib/topic";
import React, { FC } from "react";



const page: FC = async () => {
  const topics = await getAllTopic(7);
  return (
    <section className="flex justify-center w-full">
      <TopicFollow topics = {topics}/>
    </section>
  );
};

export default page;
