import { BookCover } from "@/components/book/BookCover";
import NoBook from "@/components/NoBook";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { getCreatedBooks } from "@/lib/user";
import { auth } from "@clerk/nextjs";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { redirect } from "next/navigation";

const page = async () => {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  const books = await getCreatedBooks(userId);

  if (books.length === 0)
    return (
      <div className="w-[350px] gap-10 h-[300px] mx-[35%] my-[7%] flex flex-col text-xl justify-center font-bold text-center items-center">
        {" "}
        <NoBook />
        <div>
          You have not created any book yet.
        </div>
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
            />
          </div>
        );
      })}
    </div>
  );
};

export default page;
