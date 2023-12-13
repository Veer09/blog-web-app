"use client";
import React, { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
const Editor = () => {
  const [isMounted, setIsMounted] = useState(false);
  const ref = useRef<EditorJS>();
  const initializeEditor = async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editorjs",
        tools: {
            header: Header,
        }
      });
      ref.current = editor;
    }
  };
  useEffect(() => {
    if (typeof window !== undefined) {
      setIsMounted(true);
    }
  }, []);
  useEffect(() => {
    const init = async () => {
      await initializeEditor();
    };
    if (isMounted) {
      init();
      return () => {
        if (ref.current) {
          ref.current.destroy();
        }
      };
    }
  }, [isMounted]);

  return <div id="editorjs"></div>;
};

export default Editor;
