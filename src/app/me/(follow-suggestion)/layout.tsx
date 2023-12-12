
import FollowNav from "@/components/FollowNav";
import { Separator } from "@/components/ui/separator";
import React, { FC, ReactNode } from "react";



const layout = ({ children }: { children: ReactNode }) => {
  return (
    <section className=" my-14 mx-28">
      <h1 className=" text-[40px] font-bold pb-3">
        Explore some new Topics and People
      </h1>
      <p className=" text-lg text-slate-500 pb-5">
        Explore captivating topics and people, follow them, and increase your
        knowledge!!
      </p>
      <FollowNav/>
      <Separator className=" bg-slate-500"/>
      {children}
    </section>
  );
}

export default layout;
