import { getUserFollowings } from "@/lib/user";
import { cachedTopic } from "@/type/topic";
import { cachedUser } from "@/type/user";
import { FC } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Separator } from "../ui/separator";
import UserFollowList from "./UserFollowList";
import ItemSelect from "./ItemSelect";

interface ItemFollowProps {
  title: string;
  data: cachedUser[] | cachedTopic[];
  followed: boolean;
}

export const isUser = (data: any): data is cachedUser[] => {
  if (data.length === 0) return false;
  return data[0].firstName !== undefined;
}

const ItemFollow: FC<ItemFollowProps> = async ({ title ,data, followed }) => {
  return (
    <div className=" my-10">
      <Card>
        <CardHeader>
          <CardTitle className=" font-bold text-xl">{title}</CardTitle>
          {/* <CardDescription>Card Description</CardDescription> */}
        </CardHeader>
        <CardContent>
          <Separator className=" mb-4" />
          {
            isUser(data) ? data.map((user, key) => {
              const followObj = {
                ...user,
                name: user.firstName + " " + user.lastName,
                isFollowed: followed,
              }
              return <ItemSelect key={key} followObj={followObj}/>
            }
          )
          : data.map((topic, key) => {
            const followObj = {
              ...topic,
              isFollowed: followed,
            }
            return <ItemSelect key={key} followObj={followObj} />
          })
          }
        </CardContent>
        <CardFooter>
          {data.length > 7 ? (
            <Dialog>
              <DialogTrigger className=" underline underline-offset-2 font-extrabold">
                Show More Users
              </DialogTrigger>
              <DialogContent>
                <UserFollowList
                  users={await getUserFollowings(undefined)}
                  isFollowed={followed}
                />
              </DialogContent>
            </Dialog>
          ) : (
            <></>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ItemFollow;
