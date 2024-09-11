import { auth } from "@clerk/nextjs/server";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { FC } from "react";
const Page: FC = () => {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const Editor = dynamic(() => import("@/components/blog-create/Editor"), {
    ssr: false,
  });

  return (
    <div className=" flex flex-col">
      <p className=" text-center font-semibold text-lg">
        Share Your Idea{" "}
      </p>
      <Editor holder={"editor-js"} />
    </div>
  );
};

export default Page;
