import React from "react";
import { getBooksByTopic } from "@/lib/topic";
import { BookCover } from "@/components/book/BookCover";
import NoBook from "@/components/NoBook";

const page = async ({ params }: { params: { name: string } }) => {
  const books = await getBooksByTopic(params.name);
  if (books.length === 0)
    return (
        <div className="w-[350px] gap-10 h-[300px] mx-[35%] my-[7%] flex flex-col text-xl justify-center font-bold text-center items-center">
        {" "}
        <NoBook />
        <div>
          There are no books in this topic yet.
        </div>
      </div>
    );
  return (
    <>
      {books.map((book, key) => {
        return (
          <div key={key}>
            <BookCover
              title={book.title}
              description={book.description}
              id={book.id}
            />
          </div>
        );
      })}
    </>
  );
};

export default page;
