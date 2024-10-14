import { getDraftById } from "@/lib/user";
import { auth } from "@clerk/nextjs/server";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import React, { FC } from "react";

interface PageProps {
  params: {
    id: string;
  };
}

const page: FC<PageProps> = async ({ params }) => {
  const Editor = dynamic(() => import("@/components/blog-create/Editor"), {
    ssr: false,
  });
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  const draft = await getDraftById(params.id, userId);
  if(draft.user_id !== userId) redirect("/dashboard/following");
  return (
    <>
        <Editor holder="editor-js" draft={draft}/>
    </>
  )
};

export default page;
