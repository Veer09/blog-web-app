import { getBlog } from "@/lib/blog";
import { OutputData } from "@editorjs/editorjs";
import dynamic from "next/dynamic";
import { FC } from "react";

interface Props {
  params: {
    id: string;
  };
}

const Page: FC<Props> = async ({ params }) => {
  const Editor = dynamic(() => import("@/components/Editor"), {
    ssr: false,
  });
  const blog = await getBlog(params.id);
  if(!blog) return;
  return (
    <div className=" flex flex-col">
      <p className=" text-center font-semibold text-lg">
        Write Your Blog Here:{" "}
      </p>
      <Editor holder={"editor-js"} blog={blog} id={params.id}/>
    </div>
  );
};

export default Page;
