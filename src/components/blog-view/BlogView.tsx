"use client";
import { EDITOR_TOOLS } from "@/lib/tools";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import { FC, useEffect, useRef } from "react";

interface BlogViewProps {
  content: OutputData;
}

const BlogView: FC<BlogViewProps> = ({ content }) => {
  const ref = useRef<EditorJS>();
  useEffect(() => {
    if (!ref.current) {
      const editor = new EditorJS({
        holder: 'editor-js',
        tools: EDITOR_TOOLS,
        inlineToolbar: true,
        readOnly: true,
        data: content,
      });
      ref.current = editor;
    }
    return () => {
      if (ref.current && ref.current.destroy) {
        ref.current.destroy();
      }
    };
  })
  return (
    <div id="editor-js" className="max-h-fit">
    </div>
  )
};

export default BlogView;
