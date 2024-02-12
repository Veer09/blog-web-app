"use client";
import { OutputData } from "@editorjs/editorjs";
import dynamic from "next/dynamic";
import React, { FC, useState } from "react";
const Page: FC = () => {
  const Editor = dynamic(() => import("@/components/Editor"), {
    ssr: false,
  });
  const [data, setData] = useState<OutputData>()
  return (
    <div className=" flex flex-col">
      <p className=" text-center font-semibold text-lg">
        Write Your Blog Here:{" "}
      </p>
      <Editor holder={"editor-js"} data={data} setData={setData}/>
    </div>
  );
};

export default Page;
