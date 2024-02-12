import { getUnfollowedTopics, getUserTopicDetail } from "@/lib/user";
import React, { FC } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import TopicFollowContainer from "@/components/TopicFollowContainer";
import TopicList from "@/components/TopicFollowList";
import { TopicDetails } from "@/type/topic";

interface TopicFollowProps {
  title: string;
  topics: TopicDetails[];
  followed: boolean;
}

const TopicFollow: FC<TopicFollowProps> = async ({
  title,
  topics,
  followed,
}) => {
  return (
    <div className=" my-10">
      <Card>
        <CardHeader>
          <CardTitle className=" font-bold text-xl">Topics to Follow</CardTitle>
          {/* <CardDescription>Card Description</CardDescription> */}
        </CardHeader>
        <CardContent>
          <Separator className=" mb-4" />
          <TopicFollowContainer topics={topics} isFollowed={followed} />
        </CardContent>
        <CardFooter>
            <Dialog>
              <DialogTrigger className=" underline underline-offset-2 font-extrabold">
                Show More Topics
              </DialogTrigger>
              <DialogContent>
                <TopicList
                  topics={
                    !followed
                      ? await getUnfollowedTopics(undefined)
                      : await getUserTopicDetail(undefined)
                  }
                  isFollowed={followed}
                />
              </DialogContent>
            </Dialog>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TopicFollow;
