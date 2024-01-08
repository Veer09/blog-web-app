'use client'
import React, { FC } from "react";
import parse from 'html-react-parser'
import edjsHTML from "editorjs-html";
import { OutputData } from "@editorjs/editorjs";
interface BlogViewProps{
    content: OutputData
}
const BlogView: FC<BlogViewProps> = ({ content }) => {
    const edjsParser = edjsHTML();
    const html = edjsParser.parse(content);
  return (
  <div className=" prose">
    {
        parse(html.join(""))
    }
  </div>
  );
};

export default BlogView;
