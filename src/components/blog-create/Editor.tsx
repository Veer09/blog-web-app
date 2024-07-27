"use client";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import { Blog, Draft } from "@prisma/client";
import { FC, useEffect, useRef, useState } from "react";
import { EDITOR_TOOLS } from "../../lib/tools";
import PostButton from "./PostButton";
import DraftButton from "./DraftButton";

interface EditorProps {
  holder: string;
  blog?: Blog & {
    topics: {
      name: string;
    }[];
  };
  draft?: Draft
}

const Editor: FC<EditorProps> = ({ holder, blog, draft }) => {
  const ref = useRef<EditorJS>();
  const [data, setData] = useState<OutputData | undefined>(blog ? blog.content as any as OutputData : draft ? draft.content as any as OutputData : undefined);
  useEffect(() => {
    if (!ref.current) {
      const editor = new EditorJS({
        holder: holder,
        tools: EDITOR_TOOLS,
        data: (blog?.content as any as OutputData) || (draft?.content as any as OutputData),
        placeholder: "Write your blog here...",
        inlineToolbar: true,
        onChange (api, event) {
          api.saver.save().then(d => setData(d));
        },
      });
      ref.current = editor;
    }
    return () => {
      if (ref.current && ref.current.destroy) {
        ref.current.destroy();
      }
    };
  }, []);
  return (
    <div className="grid grid-cols-[4fr_1fr]">
      <div id={holder} className="prose max-w-full" />
      <div className="flex flex-col gap-4">
        <PostButton data={data} blog={blog} />
        <DraftButton data={data} draft={draft}/>
      </div>
    </div>
  );
};
export default Editor;
