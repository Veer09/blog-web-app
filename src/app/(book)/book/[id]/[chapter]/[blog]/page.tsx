import { BlogPage } from "@/components/blog-view/BlogPage";
import BookNavbar from "@/components/book/BookNavbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getFullBook } from "@/lib/book";
import { notFound } from "next/navigation";
import React, { FC } from "react";

interface Props {
  params: {
    id: string;
    chapter: number;
    blog: number;
  };
}

const page: FC<Props> = async ({ params }) => {
  const book = await getFullBook(params.id);
  if (!book) notFound();
  return (
    <>
      <BookNavbar book={book}>
        <ScrollArea className="h-screen">
          <BlogPage id={book.chapters[params.chapter].blogs[params.blog].id} />
        </ScrollArea>
      </BookNavbar>
    </>
  );
};

export default page;
