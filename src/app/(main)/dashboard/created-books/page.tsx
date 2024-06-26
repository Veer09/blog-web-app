import { BookCover } from "@/components/book/BookCover";
import { getCreatedBooks } from "@/lib/user";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const page = async () => {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  const books = await getCreatedBooks();
  if (!books) return <h1>No Books Found!!</h1>;
  return (
    <div className=" grid grid-cols-5 gap-4">
      {books.map((book) => {
        return (
          <div key={book.id}>
            <BookCover
              title={book.title}
              description={book.description}
              id={book.id}
            />
          </div>
        );
      })}
    </div>
  );
};

export default page;
