import MePage from "@/components/MePage";
import { getCreatedBooks, getUserBlogs } from "@/lib/user";
import { ClerkUserTransfer } from "@/type/user";
import { clerkClient, User } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import React from "react";

const page = async ({ params }: { params: { id: string } }) => {
  let user: User;
  try {
    user = await clerkClient.users.getUser(params.id);
  } catch (err: any) {
    console.log(err);
    notFound();
  }
  const blogs = await getUserBlogs(params.id);
  const books = await getCreatedBooks(params.id);
  const userObj: ClerkUserTransfer = {
    fullName: user.fullName,
    id: user.id,
    publicMetadata: user.publicMetadata,
    emailAddresses: user.emailAddresses.map((email) => email.emailAddress),
    imageUrl: user.imageUrl
  }
  return (
    <div>
      <MePage blogs={blogs} books={books} user={userObj} />
    </div>
  );
};

export default page;
