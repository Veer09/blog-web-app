import OnLogin from "@/components/OnLogin";
import { getAllTopic } from "@/lib/topic";
import React, { FC } from "react";



const page: FC = async () => {
  const topics = await getAllTopic(7);
  return (
    <section className="flex justify-center w-full">
      <OnLogin topics = {topics}/>
    </section>
  );
};

export default page;
