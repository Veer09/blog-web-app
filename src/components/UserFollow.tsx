import { UserDetails, cachedUser } from "@/type/user";
import { Dialog, DialogTrigger, DialogContent } from "./ui/dialog";
import { Separator } from "./ui/separator";
import React, { FC } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/card";
import UserFollowContainer from "./UserFollowContainer";
import UserFollowList from "./UserFollowList";
import { getUserFollowings } from "@/lib/user";


interface UserFollowProps {
  title: string;
  users: cachedUser[];
  followed: boolean;
}

const UserFollow: FC<UserFollowProps> = async ({ title, users, followed }) => {
  return (
    <div className=" my-10">
      <Card>
        <CardHeader>
          <CardTitle className=" font-bold text-xl">{title}</CardTitle>
          {/* <CardDescription>Card Description</CardDescription> */}
        </CardHeader>
        <CardContent>
          <Separator className=" mb-4" />
          <UserFollowContainer users={users} isFollowed={followed} />
        </CardContent>
        <CardFooter>
          {users.length > 7 ? (
            <Dialog>
              <DialogTrigger className=" underline underline-offset-2 font-extrabold">
                Show More Users
              </DialogTrigger>
              <DialogContent>
                <UserFollowList
                  users={
                    await getUserFollowings(undefined)
                  }
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

export default UserFollow;
