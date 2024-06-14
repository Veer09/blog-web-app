"use client";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChapterType } from "@/lib/book";
import { BookIcon, ChevronRightIcon, MenuIcon, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { FC, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface BookNavbarProps {
  book: {
    title: string;
    description: string;
    topic: string;
    userId: string;
    chapters: ChapterType[];
  };
  children: React.ReactNode;
}

const BookNavbar: FC<BookNavbarProps> = ({ book, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  return (
    <div
      className={`grid min-h-screen w-full ${
        isSidebarOpen ? "grid-cols-[20%_80%]" : "grid-cols-[5%_95%]"
      } overflow-hidden h-screen`}
    >
      <div
        className={`shrink-0 border-r bg-muted/40  dark:border-gray-800 dark:bg-gray-900  ${
          isSidebarOpen ? "block" : "hidden"
        }`}
      >
        <div className="flex h-full flex-col justify-between">
          <div>
            <div className="flex h-[60px] items-center p-2 justify-between border-b">
              <Link className="flex items-center gap-2 font-bold" href="#">
                <BookIcon className="h-6 w-6" />
                <span>Book Overview</span>
              </Link>
              <Button
                className="rounded-full border border-gray-200 w-8 h-8 dark:border-gray-800"
                size="icon"
                variant="ghost"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <MenuIcon className="h-4 w-4" />
                <span className="sr-only">Toggle sidebar</span>
              </Button>
            </div>
            <div className="space-y-6 mt-6">
              {book.chapters.map((chapter, index) => {
                return (
                  <Collapsible
                    className="space-y-1"
                    defaultOpen={parseInt(pathname.split("/")[3]) === index}
                  >
                    <CollapsibleTrigger
                      className={`flex w-full items-center justify-between rounded-md px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800 [&[data-state=open]>svg]:rotate-90`}
                    >
                      <span>{chapter.title}</span>
                      <ChevronRightIcon className="h-4 w-4 transition-transform" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-1 pl-4">
                      {chapter.blogs.map((blog, key) => {
                        return (
                          <Link
                            className={`block rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors ${
                              parseInt(pathname.split("/")[4]) === key &&
                              "bg-gray-200"
                            } hover:bg-gray-300 dark:text-gray-400 dark:hover:bg-gray-800`}
                            href={`/book/${
                              pathname.split("/")[2]
                            }/${index}/${key}`}
                          >
                            {blog.title}
                          </Link>
                        );
                      })}
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div
        className={`shrink-0 border-r bg-gray-100 dark:border-gray-800 dark:bg-gray-900  ${
          !isSidebarOpen ? "block" : "hidden"
        } flex justify-center py-5`}
      >
        <Button
          className="rounded-full border border-gray-200 w-8 h-8 dark:border-gray-800"
          size="icon"
          variant="ghost"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <MenuIcon className="h-4 w-4" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <div className="w-full flex mx-7 justify-between">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search Blogs..."
                  className="w-full appearance-none bg-background pl-8 shadow-none"
                />
              </div>
            </form>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default BookNavbar;
