"use client";
import { useUser } from "@clerk/nextjs";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { FC } from "react";
const Page: FC = () => {

  const { user } = useUser() 
  if(!user) redirect("/sign-in");

  const Editor = dynamic(() => import("@/components/blog-create/Editor"), {
    ssr: false,
  });
  
  return (
    <div className=" flex flex-col">
      <p className=" text-center font-semibold text-lg">
        Write Your Blog Here:{" "}
      </p>
      <Editor holder={"editor-js"} blog={null}/>
    </div>
  );
};

export default Page;
