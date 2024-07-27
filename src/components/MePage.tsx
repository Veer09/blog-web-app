"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { cachedBlog } from "@/type/blog";
import { BookMetaData } from "@/type/book";
import { ClerkUserTransfer } from "@/type/user";
import { useAuth, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { FC, useState } from "react";
import BlogCard from "./blog-view/BlogCard";
import { BookCover } from "./book/BookCover";
import { Avatar, AvatarImage } from "./ui/avatar";

interface MePageProps {
  blogs: cachedBlog[];
  books: BookMetaData[];
  user: ClerkUserTransfer;
}

const MePage: FC<MePageProps> = ({ blogs, books, user }) => {
  const [activeTab, setActiveTab] = useState("blogs");
  const { userId } = useAuth();

  return (
    <div className="w-full max-w-5xl mx-auto py-12 md:py-16 lg:py-18">
      <div className="grid gap-10 md:grid-cols-[200px_1fr] lg:grid-cols-[250px_1fr]">
        <div className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            {user.id === userId ? (
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarImage: "h-24 w-24",
                    rootBox: "h-24 w-24",
                    userButtonTrigger: "h-24 w-24",
                    userButtonBox: "h-24 w-24",
                    userButtonAvatarBox: "h-24 w-24",
                  },
                }}
              />
            ) : (
              <Avatar>
                <AvatarImage src={user.imageUrl} className="h-24 w-24" />
              </Avatar>
            )}

            <div className="text-center">
              <h2 className="text-2xl font-bold">{user.fullName}</h2>
              {/* <p className="text-muted-foreground">Software Engineer</p> */}
            </div>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <MailIcon className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground">
                {user.emailAddresses.map((address) => address)}
              </span>
            </div>
            <div>
              {user.publicMetadata.socialMedia
                ? (user.publicMetadata.socialMedia as string[]).map(
                    (social: any, index) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        <LinkIcon className="h-5 w-5 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {social.name}: {social.value}
                        </span>
                      </div>
                    )
                  )
                : null}
            </div>
            <Link href="/me/edit" className={`${buttonVariants()}`}>
              Edit Profile
            </Link>
          </div>
        </div>
        <div className="space-y-6">
          {user.publicMetadata.about ? (
            <div>
              <h3 className="text-2xl font-bold">About</h3>
              <p className="mt-2 text-muted-foreground">
                {user.publicMetadata.about as string}
              </p>
            </div>
          ) : null}
          <div>
            <div className="flex items-center gap-4 border-b border-muted/20 pb-4">
              <Button
                variant={activeTab === "blogs" ? "default" : "ghost"}
                onClick={() => setActiveTab("blogs")}
                className="px-4 py-2 rounded-md"
              >
                Blogs
              </Button>
              <Button
                variant={activeTab === "books" ? "default" : "ghost"}
                onClick={() => setActiveTab("books")}
                className="px-4 py-2 rounded-md"
              >
                Books
              </Button>
            </div>
            {activeTab === "blogs" && (
              <>
                {blogs.length === 0 ? (
                  <div className=" flex w-full h-full justify-center my-[10%]">
                    <Image
                      src="/MessyDoodle.svg"
                      height={300}
                      width={300}
                      alt="No Blog"
                    />
                  </div>
                ) : (
                  blogs.map((blog, key) => <BlogCard key={key} blog={blog} />)
                )}
              </>
            )}
            {activeTab === "books" && (
              <>
                {books.length === 0 ? (
                  <div className=" flex w-full h-full justify-center my-[10%]">
                    <Image
                      src="/SitReadingDoodle.svg"
                      height={300}
                      width={300}
                      alt="No Blog"
                    />
                  </div>
                ) : (
                  books.map((book, key) => (
                    <BookCover
                      key={key}
                      title={book.title}
                      description={book.description}
                      id={book.id}
                    />
                  ))
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function ArrowRightIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function LinkIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function LocateIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="2" x2="5" y1="12" y2="12" />
      <line x1="19" x2="22" y1="12" y2="12" />
      <line x1="12" x2="12" y1="2" y2="5" />
      <line x1="12" x2="12" y1="19" y2="22" />
      <circle cx="12" cy="12" r="7" />
    </svg>
  );
}

function MailIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function XIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export default MePage;
