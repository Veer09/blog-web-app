import React, { Dispatch, SetStateAction, useEffect, useRef } from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import { EDITOR_TOOLS } from "../lib/tools";
import { Button } from "./ui/button";

export default function Editor({
  holder,
  data,
  setData,
}: {
  holder: string;
  data: OutputData | undefined;
  setData: Dispatch<SetStateAction<OutputData | undefined>>;
}) {
  const ref = useRef<EditorJS>();
  useEffect(() => {
    if (!ref.current) {
      const editor = new EditorJS({
        holder: holder,
        tools: EDITOR_TOOLS,
        autofocus: true,
        data: data,
        inlineToolbar: true,
      });
      ref.current = editor;
    }
    return () => {
      if (ref.current && ref.current.destroy) {
        ref.current.destroy();
      }
    };
  }, []);

  const saveData = () => {
      if(!ref.current) return ;
      ref.current.save().then((data) => {
        console.log(data);
      })
  }

  return (
    <div>
      <div id={holder} className="prose max-w-full" />
      <div className=" flex justify-center">
        <Button className=" w-[100px]" onClick={saveData}>Post</Button>
      </div>
    </div>
  );
}
