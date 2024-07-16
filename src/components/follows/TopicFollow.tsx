import { cachedTopic } from "@/type/topic";
import { FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Separator } from "../ui/separator";
import ItemSelect from "./ItemSelect";
import TopicFollowList from "./TopicFollowList";

interface TopicFollowProps {
  title: string;
  data: cachedTopic[];
  followed: boolean;
}

const TopicFollow: FC<TopicFollowProps> = async ({ title, data, followed }) => {
  return (
    <div className=" my-10">
      <Card>
        <CardHeader>
          <CardTitle className=" font-bold text-xl">{title}</CardTitle>
          <CardDescription>Card Description</CardDescription> 
        </CardHeader>
        <CardContent>
          <Separator className=" mb-4" />
          {
            data.map((topic, key) => {
              const followObj = {
                ...topic,
                isFollowed: followed,
              };
              return <ItemSelect key={key} followObj={followObj} />;
            })}
        </CardContent>
        <CardFooter>
          {data.length == 7 && (
            <Dialog>
              <DialogTrigger className=" underline underline-offset-2 font-extrabold">
                Show More Topics
              </DialogTrigger>
              <DialogContent>
                <TopicFollowList topics={data} isFollowed={followed} />
              </DialogContent>
            </Dialog>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default TopicFollow;
