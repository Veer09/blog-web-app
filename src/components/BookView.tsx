import {
  Link,
  Package2Icon,
  PlusIcon,
  BookOpenIcon,
  FileEditIcon,
} from "lucide-react";
import React from "react";
import { Button } from "./ui/button";

const BookView = () => {
  return (
    <div>
      <div className="flex flex-col min-h-screen">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
          <Link className="lg:hidden" href="#">
            <Package2Icon className="h-6 w-6" />
            <span className="sr-only">Home</span>
          </Link>
          <h1 className="font-semibold text-lg md:text-2xl">Chapters</h1>
          <Button size="sm">Save</Button>
          <Button
            className="rounded-full ml-auto"
            size="icon"
            variant="outline"
          >
            <PlusIcon className="h-4 w-4" />
            <span className="sr-only">Add chapter</span>
          </Button>
        </header>

        <main className="flex-1 flex flex-col gap-4 p-4 md:gap-8 md:p-6">
          <div className="grid gap-2">
            <div className="grid gap-1">
              <div className="flex items-center gap-2">
                <BookOpenIcon className="h-6 w-6" />
                <h2 className="font-semibold text-lg">Introduction</h2>
                <Button
                  className="rounded-full ml-auto"
                  size="icon"
                  variant="outline"
                >
                  <FileEditIcon className="h-4 w-4" />
                  <span className="sr-only">Edit chapter</span>
                </Button>
                <Button className="rounded-full" size="icon" variant="outline">
                  <PlusIcon className="h-4 w-4" />
                  <span className="sr-only">Add subchapter</span>
                </Button>
              </div>
              <div className="grid gap-2 ml-8">
                <div className="flex items-center gap-2">
                  <BookOpenIcon className="h-6 w-6" />
                  <h2 className="font-semibold text-base">About this book</h2>
                  <Button
                    className="rounded-full ml-auto"
                    size="icon"
                    variant="outline"
                  >
                    <FileEditIcon className="h-4 w-4" />
                    <span className="sr-only">Edit chapter</span>
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpenIcon className="h-6 w-6" />
                  <h2 className="font-semibold text-base">
                    How to use this book
                  </h2>
                  <Button
                    className="rounded-full ml-auto"
                    size="icon"
                    variant="outline"
                  >
                    <FileEditIcon className="h-4 w-4" />
                    <span className="sr-only">Edit chapter</span>
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <BookOpenIcon className="h-6 w-6" />
              <h2 className="font-semibold text-lg">Chapter 2: The Middle</h2>
              <Button
                className="rounded-full ml-auto"
                size="icon"
                variant="outline"
              >
                <FileEditIcon className="h-4 w-4" />
                <span className="sr-only">Edit chapter</span>
              </Button>
              <Button className="rounded-full" size="icon" variant="outline">
                <PlusIcon className="h-4 w-4" />
                <span className="sr-only">Add subchapter</span>
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <BookOpenIcon className="h-6 w-6" />
              <h2 className="font-semibold text-lg">Chapter 3: The End</h2>
              <Button
                className="rounded-full ml-auto"
                size="icon"
                variant="outline"
              >
                <FileEditIcon className="h-4 w-4" />
                <span className="sr-only">Edit chapter</span>
              </Button>
              <Button className="rounded-full" size="icon" variant="outline">
                <PlusIcon className="h-4 w-4" />
                <span className="sr-only">Add subchapter</span>
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BookView;
