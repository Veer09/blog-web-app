import { cachedUser } from "@/type/user";
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
import UserFollowList from "./UserFollowList";

interface UserFollowProps {
  title: string;
  data: cachedUser[];
  followed: boolean;
}

const UserFollow: FC<UserFollowProps> = async ({ title, data, followed }) => {
  return (
    <div className=" my-10">
      <Card>
        <CardHeader>
          <CardTitle className=" font-bold text-xl">{title}</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <Separator className=" mb-4" />
          {data &&
            data.map((user, key) => {
              const followObj = {
                ...user,
                name: (user.firstName && user.lastName) ? user.firstName + " " + user.lastName : (user.firstName) ? user.firstName : (user.lastName) ? user.lastName : "",
                isFollowed: followed,
              };
              return <ItemSelect key={key} followObj={followObj} />;
            })}
        </CardContent>
        <CardFooter>
          {data.length == 7 && (
            <Dialog>
              <DialogTrigger className=" underline underline-offset-2 font-extrabold">
                Show More Users
              </DialogTrigger>
              <DialogContent>
                <UserFollowList users={data} isFollowed={followed} />
              </DialogContent>
            </Dialog>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default UserFollow;
