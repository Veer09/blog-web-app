import MePage from "@/components/MePage";
import { getCreatedBooks, getUserBlogs } from "@/lib/user";
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
    console.log(err);
    notFound();
  }
  const userObj: ClerkUserTransfer = {
    fullName: user.fullName,
    id: user.id,
    publicMetadata: user.publicMetadata,
    emailAddresses: user.emailAddresses.map((email) => email.emailAddress),
    imageUrl: user.imageUrl
  }
  const blogs = await getUserBlogs(userId);
  const books = await getCreatedBooks(userId);
  return <MePage blogs={blogs} books={books} user={userObj} />;
};

export default page;
