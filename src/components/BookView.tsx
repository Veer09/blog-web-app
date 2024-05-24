import { ChapterType } from "@/lib/book";
import { BookOpenIcon, File } from "lucide-react";
import Link from "next/link";
import React, { FC } from "react";

interface BookViewProps {
  chapter: ChapterType;
  main: boolean;
}

const BookView: FC<BookViewProps> = ({ chapter, main }) => {
  return (
    <div className=" mx-6 my-3">
      <div className=" flex gap-4">
        <BookOpenIcon className="h-6 w-6" />
        <h2 className={`${(main) ? "font-semibold text-lg" : "font-medium text-base"}`}>{chapter.title}</h2>
      </div>
      {chapter.chapters.map((subChapter, key) => {
        return <BookView key={key} main={false} chapter={subChapter} />;
      })}
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
    </div>
  );
};

export default BookView;
