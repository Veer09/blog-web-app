"use client";
import { OutputData } from "@editorjs/editorjs";
import edjsHTML from "editorjs-html";
import parse from "html-react-parser";
import { FC } from "react";

interface BlogViewProps {
  content: OutputData;
}

const BlogView: FC<BlogViewProps> = ({ content }) => {
  const tableParser = (block: any) => {
    return `<table>
        <tbody>
          ${
            block.data.content.map((row: any, index: number) => {
              return (
                `<tr key={index}>
                  ${
                    row.map((cell: any, index: number) => {
                      return (
                        `<td key={index}>
                          ${parse(cell)}
                        </td>`
                      )
                    })
                  }
                </tr>`
              )
            })
          }
        </tbody>
      </table>`
  };

  const checkboxParser = (block: any) => {
    return `
        <div className="flex items-center space-x-2">
      <input type="checkbox" id="terms" />
      <label
        htmlFor="terms"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
       ${block.data.text}
      </label>
    </div>`
  }
  const edjsParser = edjsHTML({table: tableParser});
  const html = edjsParser.parse(content);
  return <div className=" prose mx-16">{parse(html.join())}</div>;
};

export default BlogView;
