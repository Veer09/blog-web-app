import { findBlogById } from "@/lib/blog";
import { OutputData } from "@editorjs/editorjs";
import dynamic from "next/dynamic";
import React, { FC, useState } from "react";

interface Props {
  params: {
    id: string;
  };
}

const Page: FC<Props> = async ({ params }) => {
  const Editor = dynamic(() => import("@/components/Editor"), {
    ssr: false,
  });
  const blog = await findBlogById(params.id);
  if(!blog) return;
  return (
    <div className=" flex flex-col">
      <p className=" text-center font-semibold text-lg">
        Write Your Blog Here:{" "}
      </p>
      <Editor holder={"editor-js"} data={JSON.parse(JSON.stringify(blog.content)) as OutputData}/>
    </div>
  );
};

export default Page;
