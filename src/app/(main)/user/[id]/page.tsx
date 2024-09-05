import MePage from "@/components/MePage";
import { getCachedUser, getCreatedBooks, getUserBlogs, isUserFollowed } from "@/lib/user";
import { ClerkUserTransfer } from "@/type/user";
import { clerkClient, User } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import React from "react";

const page = async ({ params }: { params: { id: string } }) => {
  let user: User;
  try {
    user = await clerkClient.users.getUser(params.id);
  } catch (err: any) {
    notFound();
  }
  const [blogs, books, cachedUser, isFollowed] = await Promise.all([getUserBlogs(params.id), getCreatedBooks(params.id), getCachedUser(params.id), isUserFollowed(params.id)]);
  console.log(isFollowed);
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
  return (
    <div>
      <MePage cachedUser={cuser} blogs={blogs} books={books} user={userObj} />
    </div>
  );
};

export default page;
