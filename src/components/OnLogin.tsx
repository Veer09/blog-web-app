'use client'
import React, { FC } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TopicsSelect from "./TopicsSelect";
import { TopicWithCount } from "@/lib/topic";
import { Separator } from "./ui/separator";
import ContextProvider from "./ContextProvider";
import { auth, useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Button } from "./ui/button";
import Link from "next/link";
import { getAuth } from "@clerk/nextjs/server";

interface OnLoginProps {
  topics: TopicWithCount[];
}

const OnLogin: FC<OnLoginProps> = ({ topics }) => {
  const { user: loggedIn } = useUser();
  if (!loggedIn) {
    redirect("/sign-in");
  }

  return (
    <Card className=" w-[70%]">
      <CardHeader className=" text-2xl text-primary ">
        <CardTitle className=" pb-3">
          Follow Atleast 3 or more topics:{" "}
        </CardTitle>
        <Separator />
      </CardHeader>
      <CardContent>
        {topics.map((topic, key) => {
          const followObj = {
            ...topic,
            isFollowed:
              topic.users.filter((user) => user.user_id === loggedIn.id).length !==
              0,
          };
          return (
            <ContextProvider followObj={followObj} key={key}>
              <TopicsSelect key={key} />
            </ContextProvider>
          );
        })}
      </CardContent>
      <Separator/>
      <div className=" py-2 flex justify-center">
        <Button className=" w-24">
          <Link href="/dashboard"> Submit </Link> 
        </Button>
      </div>
    </Card>
  );
};

export default OnLogin;
