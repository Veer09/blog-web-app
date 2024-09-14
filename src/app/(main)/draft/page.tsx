import DraftCard from "@/components/DraftCard";
import { Separator } from "@/components/ui/separator";
import { getDraftBlogs } from "@/lib/user";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

const page = async () => {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  const drafts = await getDraftBlogs(userId);
  if(drafts.length === 0)     return (
    <div className="w-[350px] gap-10 h-[300px] mx-auto my-[20%] lg:my-[10%] flex flex-col text-xl justify-center font-bold text-center items-center">
      {" "}
      <Image src="/MessyDoodle.svg" height={300} width={300} alt="No Blog"/>
      <div className="flex flex-col gap-4 items-center">
        <div className=" text-2xl font-bold">There isn{'\''}t any draft blog!!</div>
        <Link href="/dashborad/following" className={`${buttonVariants()} w-40`}>Write your first blog</Link>
      </div>
    </div>
  );
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
