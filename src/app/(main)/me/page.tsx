import MePage from "@/components/MePage";
import { getCachedUser, getCreatedBooks, getUserBlogs, isUserFollowed } from "@/lib/user";
import { ClerkUserTransfer } from "@/type/user";
import { auth, clerkClient, User } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  let user: User;
  try {
    user = await clerkClient.users.getUser(userId);
  } catch (err: any) {
    notFound();
  }
  const [blogs, books, cachedUser, isFollowed] = await Promise.all([getUserBlogs(userId), getCreatedBooks(userId), getCachedUser(userId), false]);
  const userObj: ClerkUserTransfer = {
    fullName: user.fullName,
    id: user.id,
    publicMetadata: user.publicMetadata,
    emailAddresses: user.emailAddresses.map((email) => email.emailAddress),
    imageUrl: user.imageUrl
  }

  const cuser = {
    ...cachedUser,
    isFollowed: isFollowed,
    name: user.fullName || "",
  }
  return <MePage cachedUser={cuser} blogs={blogs} books={books} user={userObj} />;
};

export default page;
