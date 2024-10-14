import { ScrollArea } from "@/components/ui/scroll-area";
import { getMostLikedBlogs } from "@/lib/blog";
import { auth } from "@clerk/nextjs/server";
import { ArrowRightIcon, PenIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const page = async () => {
  const { userId } = auth();
  if (userId) {
    redirect("/dashboard/following");
  }
  const blogs = await getMostLikedBlogs();
  return (
    <ScrollArea className="h-screen">
      <div className="flex flex-col min-h-[100dvh]">
        <header className="px-4 lg:px-6 h-14 flex items-center">
          <Link
            href="/sign-in"
            className="flex items-center justify-center"
            prefetch={false}
          >
            <PenIcon className="h-6 w-6" />
            <span className="sr-only">Blog Sharing</span>
          </Link>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link
              href="/sign-in"
              className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
            >
              Login
            </Link>
          </nav>
        </header>
        <main className="flex-1">
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6 grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Share Your Passion, Inspire the World
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Join our vibrant community of bloggers and share your unique
                  perspectives. Discover a platform that celebrates your voice
                  and connects you with like-minded individuals.
                </p>
                <Link
                  href="/sign-in"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                >
                  Share Your Blog
                </Link>
              </div>
              <Image
                src="/placeholder.svg"
                width="550"
                height="400"
                alt="Hero"
                className="mx-auto aspect-[4/3] overflow-hidden rounded-xl object-cover sm:w-full"
              />
            </div>
          </section>
          <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                    Featured Blog Posts
                  </h2>
                  <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                    Explore a curated selection of inspiring blog posts from our
                    community.
                  </p>
                </div>
              </div>
              <div className="mx-auto grid gap-6 py-12 sm:grid-cols-2 md:grid-cols-3 lg:gap-12">
                {blogs.map((blog, key) => (
                  <div
                    key={key}
                    className="group flex flex-col rounded-lg bg-white shadow-sm transition-all hover:scale-[1.02] hover:shadow-md dark:bg-gray-950 dark:shadow-none dark:hover:bg-gray-800"
                  >
                    {
                      blog.coverImage && (
                        <img
                          src={blog.coverImage}
                          width="420"
                          height="200"
                          alt="Blog Post"
                          className="aspect-[3/2] overflow-hidden rounded-t-lg object-cover object-center"
                        />
                      )
                    }
                    <div className="flex flex-1 flex-col justify-between p-4">
                      <div>
                        <h3 className="text-xl font-bold tracking-tight">
                          {blog.title}
                        </h3>
                        <p className="mt-2 line-clamp-3 text-gray-500 dark:text-gray-400">
                          {blog.description}
                        </p>
                      </div>
                      <Link
                        href={`/blog/${blog.id}`}
                        className="mt-4 inline-flex items-center font-medium text-gray-900 hover:text-gray-700 dark:text-gray-50 dark:hover:text-gray-300"
                      >
                        Read More
                        <ArrowRightIcon className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-8">
                <Link
                  href="/sign-in"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                  prefetch={false}
                >
                  Explore More
                </Link>
              </div>
            </div>
          </section>
        </main>
        <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            &copy; 2024 Blog Sharing. All rights reserved.
          </p>
        </footer>
      </div>
    </ScrollArea>
  );
};

export default page;
