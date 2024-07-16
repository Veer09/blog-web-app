"use client";
import { handleClientError } from "@/lib/error";
import { UserFollowSchema, cachedUser } from "@/type/user";
import { QueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { Button } from "../ui/button";

interface UserFollowButtonProps {
  user: cachedUser & { isFollowed: boolean; name: string };
  setUser: (user: cachedUser & { isFollowed: boolean; name: string }) => void;
}

const UserFollowButton: FC<UserFollowButtonProps> = ({ user, setUser }) => {
  const router = useRouter();
  const queryClient = new QueryClient();

  const { mutate: follow, isPending: followPending } = useMutation({
    mutationKey: ["follow"],
    mutationFn: (id: string) => {
      const payload = UserFollowSchema.parse(id);
      return axios.post("/api/user/follow", { payload });
    },
    onMutate: () => {
      setUser({
        ...user,
        blogs: user.blogs,
        followers: user.followers + 1,
        isFollowed: !user.isFollowed,
      });
    },
    onError: (err) => {
      handleClientError(err);
      router.refresh();
    },
  });

  const { mutate: unfollow, isPending: unfollowPending } = useMutation({
    mutationKey: ["follow"],
    mutationFn: (id: string) => {
      const payload = UserFollowSchema.parse(id);
      return axios.post("/api/user/unfollow", { payload });
    },
    onMutate: () => {
      setUser({
        ...user,
        blogs: user.blogs,
        followers: user.followers - 1,
        isFollowed: !user.isFollowed,
      });
    },
    onError: (err) => {
      handleClientError(err);
      router.refresh();
    },
  });
  return (
    <Button
      variant={user.isFollowed ? "outline" : "default"}
      onClick={
        user.isFollowed ? () => unfollow(user.id) : () => follow(user.id)
      }
      disabled={followPending || unfollowPending ? true : false}
    >
      {user.isFollowed ? "Following" : "Follow"}
    </Button>
  );
};

export default UserFollowButton;
