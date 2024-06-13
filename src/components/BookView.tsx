import { ChapterType } from "@/lib/book";
import { BookOpenIcon, File } from "lucide-react";
import Link from "next/link";
import React, { FC } from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

interface BookViewProps {
  chapter: ChapterType;
  main: boolean;
  index: number;
}

const BookView: FC<BookViewProps> = ({ chapter, main, index }) => {
  return (
    <AccordionItem value={`item-${index}`} className=" mx-6 my-3">
      <AccordionTrigger>
        <div className=" flex items-center w-full justify-between">
          <div className=" flex gap-4 items-center">
            <BookOpenIcon className ="h-6 w-6" />
            <h2
              className={`${
                main ? "font-semibold text-lg" : "font-medium text-base"
              }`}
            >
              {chapter.title}
            </h2>
          </div>
          <div className=" mr-4"> {chapter.takenFrom} </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className=" flex flex-col gap-4">
        {chapter.blogs.map((blog, key) => {
          return (
            <Link href={`/blog/${blog.id}`} key={key}>
              <div className="flex gap-4 mx-6 text-gray-600 hover:text-slate-900">
                <File className="h-6 w-6" />
                <h2 className="font-medium text-base ">{blog.title}</h2>
              </div>
            </Link>
          );
        })}
      </AccordionContent>
    </AccordionItem>
  );
};

export default BookView;
