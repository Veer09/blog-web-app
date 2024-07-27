import Editor from "@/components/blog-create/Editor";
import { findDraftById } from "@/lib/user";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React, { FC } from "react";

interface PageProps {
  params: {
    id: string;
  };
}

const page: FC<PageProps> = async ({ params }) => {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  const draft = await findDraftById(params.id, userId);
  return (
    <>
        <Editor holder="editor-js" draft={draft}/>
    </>
  )
};

export default page;
