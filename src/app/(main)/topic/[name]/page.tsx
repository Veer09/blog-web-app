import BlogCard from "@/components/blog-view/BlogCard";
import { BookCover } from "@/components/book/BookCover";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getBlogByTopic, getBooksByTopic } from "@/lib/topic";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

interface PageProps {
  params: {
    name: string;
  };
}

const page: FC<PageProps> = async ({ params }) => {
  const blogs = await getBlogByTopic(params.name);
  const books = await getBooksByTopic(params.name);
  return (
    <Tabs defaultValue="blog" className="">
      <TabsList className="grid w-[400px] grid-cols-2">
        <TabsTrigger value="blog">Blogs</TabsTrigger>
        <TabsTrigger value="book">Books</TabsTrigger>
      </TabsList>
      <TabsContent value="blog">
        {blogs.length === 0 && (
          <div className="w-[350px] gap-10 h-[300px] mx-[35%] my-[7%] flex flex-col text-xl justify-center font-bold text-center items-center">
            {" "}
            <Image
              src="/MessyDoodle.svg"
              height={300}
              width={300}
              alt="No Blog"
            />
            <div className="flex flex-col gap-4 items-center">
              <div className=" text-2xl font-bold">
                There is no blog in this topic
              </div>
              <Link
                href="/dashborad/following"
                className={`${buttonVariants()} w-40`}
              >
                Write your blog in this topic
              </Link>
            </div>
          </div>
        )}
        <div className="w-[80%]">
          {blogs.map((blog, key) => {
            return (
              <div key={key}>
                <BlogCard blog={blog} key={key} />
              </div>
            );
          })}
        </div>
      </TabsContent>
      <TabsContent value="book">
        {books.length === 0 && (
          <div className=" flex flex-col gap-4 w-full h-full justify-center items-center my-[10%]">
            <Image
              src="/SitReadingDoodle.svg"
              height={300}
              width={300}
              alt="No Blog"
            />
            <div className="text-2xl font-bold">There are no books in this topic yet.</div>
          </div>
        )}

        <div>
          {books.map((book, key) => {
            return (
              <div key={key}>
                <BookCover
                  title={book.title}
                  description={book.description}
                  topic={book.topic}
                  id={book.id}
                  coverImage={book.coverImage}
                  darkText={book.darkText}
                />
              </div>
            );
          })}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default page;
