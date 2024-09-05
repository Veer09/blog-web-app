import { BookCover } from "@/components/book/BookCover";
import { getCreatedBooks } from "@/lib/user";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";
const page = async () => {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  const books = await getCreatedBooks(userId);

  if (books.length === 0)
    return (
      <div className=" flex flex-col gap-3 items-center w-full h-full justify-center my-[10%]">
        <Image
          src="/SitReadingDoodle.svg"
          height={300}
          width={300}
          alt="No Blog"
        />
        <div className="text-2xl font-bold">You haven{'\''}t created any book yet!!</div>
      </div>
    );
  return (
    <div className=" grid grid-cols-5 gap-4">
      {books.map((book, key) => {
        return (
          <div key={key}>
            <BookCover
              title={book.title}
              description={book.description}
              id={book.id}
              topic={book.topic}
              coverImage={book.coverImage}
              darkText={book.darkText}
            />
          </div>
        );
      })}
    </div>
  );
};

export default page;
