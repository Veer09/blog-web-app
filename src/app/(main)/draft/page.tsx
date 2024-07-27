import DraftCard from "@/components/DraftCard";
import { Separator } from "@/components/ui/separator";
import { getDraftBlogs } from "@/lib/user";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  const drafts = await getDraftBlogs(userId);
  return (
    <div>
      {drafts.map((draft, key) => {
        return (
          <>
            <DraftCard draft={draft} key={key} />
            <Separator/>
          </>
        );
      })}
    </div>
  );
};

export default page;
