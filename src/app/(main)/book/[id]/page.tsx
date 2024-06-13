import BookFollowButton from "@/components/BookFollowButton";
import BookView from "@/components/BookView";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getFullBook, isFollowBook } from "@/lib/book";
import { auth } from "@clerk/nextjs";
import Link from "next/link";

const page = async ({ params }: { params: { id: string } }) => {
  const book = await getFullBook(params.id);
  if (!book) return <div>Book not found</div>;
  const isFollowed = await isFollowBook(params.id);
  const { userId } = auth();
  return (
    <div className=" flex my-4 justify-center items-center">
      <Card className=" w-full">
        <CardHeader className=" font-extrabold text-xl pb-2 pt-4 space-y-0 px-4">
          <div className="flex justify-between mr-4">
            <div>{book.title}</div>
            <div>
              {userId && userId !== book.userId ? (
                <BookFollowButton isFollowed={isFollowed} bookId={params.id} />
              ) : (
                <Button>
                  <Link href={`/book/update/${params.id}`}>Edit</Link>
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardDescription className="mx-4 mb-4">
          {book.description}
        </CardDescription>
        <Separator />
        <CardContent>
          <main className="flex-1 flex flex-col gap-4 p-4 md:gap-8 md:p-6">
            <div className="grid gap-2">
              <div className="grid gap-1">
                <Accordion type="multiple">
                  {book.chapters.map((chapter, key) => {
                    return (
                      <div key={key}>
                        <BookView main={true} index={key} key={key} chapter={chapter} />
                      </div>
                    );
                  })}
                </Accordion>
              </div>
            </div>
          </main>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
