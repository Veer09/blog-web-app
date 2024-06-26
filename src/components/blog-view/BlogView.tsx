'use client'
import { OutputData } from "@editorjs/editorjs";
import edjsHTML from "editorjs-html";
import parse from 'html-react-parser';
import { FC } from "react";
interface BlogViewProps{
    content: OutputData
}

const BlogView: FC<BlogViewProps> = ({ content }) => {
    const edjsParser = edjsHTML();
    const html = edjsParser.parse(content);
  return (
  <div className=" prose mx-16">
    {
        parse(html.join(""))
    }
  </div>
  );
};

export default BlogView;
