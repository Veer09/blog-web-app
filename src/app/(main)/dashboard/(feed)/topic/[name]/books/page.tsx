import { BookCover } from "@/components/book/BookCover";
import { getBooksByTopic } from "@/lib/topic";
import Image from "next/image";
const page = async ({ params }: { params: { name: string } }) => {
  const books = await getBooksByTopic(params.name);
  if (books.length === 0)
    return (
      <div className=" flex w-full h-full justify-center my-[10%]">
        <Image
          src="/SitReadingDoodle.svg"
          height={300}
          width={300}
          alt="No Blog"
        />
        <div>There are no books in this topic yet.</div>
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
