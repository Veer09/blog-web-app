import BookView from "@/components/BookView";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getBook } from "@/lib/book";
import { BookOpenIcon, Link2Icon, PlusIcon } from "lucide-react";
import React from "react";

const page = async ({ params }: { params: { id: string } }) => {
  const book = await getBook(params.id);
  if (!book) return <div>Book not found</div>;
  return (
    <div className=" flex my-4 justify-center items-center">
      <Card className=" w-full">
        <CardHeader className=" font-extrabold text-xl pb-2 pt-4 space-y-0 px-4">
          {book.title}
        </CardHeader>
        <CardDescription className="mx-4 mb-4">
          {book.description}
        </CardDescription>
        <Separator />
        <CardContent>
          <main className="flex-1 flex flex-col gap-4 p-4 md:gap-8 md:p-6">
            <div className="grid gap-2">
              <div className="grid gap-1">
                {book.chapters.map((chapter, key) => {
                  return (
                    <div key={key}>
                      <BookView main={true} key={key} chapter={chapter} />
                    </div>
                  );
                })}
              </div>
            </div>
          </main>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
