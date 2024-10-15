import BlogView from "@/components/blog-view/BlogView";
import TopicList from "@/components/blog-view/TopicList";
import UserInteraction from "@/components/blog-view/UserInteraction";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getBlogById, setBlog } from "@/lib/blog";
import { redis } from "@/lib/redis";
import { isBlogLiked, isBlogSaved, setBlogRead, setUser } from "@/lib/user";
import { cn } from "@/lib/utils";
import { cachedUser } from "@/type/user";
import { auth } from "@clerk/nextjs/server";
import { OutputData } from "@editorjs/editorjs";
import { unstable_cache } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FC } from "react";
import BlogDeleteBtn from "./BlogDeleteBtn";
import { Metadata } from "next";

interface Props {
  id: string;
}

export const BlogPage: FC<Props> = async ({ id }) => {
  //Blog
  const getBlog = unstable_cache(
    async () => {
      return await getBlogById(id)
    },
    ["blog", id],
    {
      tags: [`blog:${id}`],
    }
  );

  const blog = await getBlog();
  if (!blog) return notFound();

  const getUser = async () => {
    let user: cachedUser | null = await redis.hgetall(`user:${blog.user_id}`);
    if (!user) {
      user = await setUser(blog.user_id);
      if (!user) return notFound()
    };
    return user;
  }

  const getLikes = async () => {
    let likes: number | null = await redis.hget(`blog:${blog.id}`, "likes");
    if (!likes) {
      const blogLikes = await setBlog(blog.id);
      if (!blogLikes) return notFound()
      likes = blogLikes.likes;
    };
    return likes;
  }

  const content = JSON.parse(JSON.stringify(blog.content)) as OutputData;

  const { userId } = auth();
  const [user, likes, liked, saved, _] = await Promise.all([getUser(), getLikes(), isBlogLiked(blog.id), isBlogSaved(blog.id), setBlogRead(blog.id, userId)]);
  return (
    <div className=" flex flex-col items-center my-10">
      <div className=" w-[90%]">
        <div className=" flex items-center justify-between">
          <div>
            <p className=" text-4xl text-slate-900 font-bold">{blog.title}</p>
            <p className=" text-gray-600 mb-4 font-semibold">
              {blog.description}
            </p>
          </div>
          {blog.user_id === userId ? (
            <div className="flex flex-col gap-3">
              <Link
                href={`/blog/customize/${blog.id}`}
                className={cn(buttonVariants())}
              >
                Customize
              </Link>
              <BlogDeleteBtn id={id} />
            </div>
          ) : (
            <></>
          )}
        </div>
        <div className="border-y-2 justify-between flex py-3 my-8 px-3 gap-8 items-center">
          <div className=" flex gap-8 justify-center items-center">
            <Link href={`/user/${blog.user_id}`}>
              <Image
                src={user.imageUrl}
                className=" w-12 h-12 rounded-[50%]"
                alt="User Image"
                width={48}
                height={48}
              />
            </Link>
            <div>
              <div className=" font-bold text-lg">
                <Link href={`/user/${blog.user_id}`} className="hover:underline hover:underline-offset-2">
                  {user.firstName + " " + (user.lastName ? user.lastName : "")}
                </Link>
              </div>
              <p>{new Date(blog.createdAt).toDateString()}</p>
            </div>
          </div>
          <div>
            <div className="flex gap-2">
              <UserInteraction
                blogId={blog.id}
                saved={saved}
                liked={liked}
                likes={likes}
              />
            </div>
          </div>
        </div>
        {blog.coverImage ? (
          <img
            src={blog.coverImage}
            className=" m-auto w-[80%] h-[300px] my-10"
            alt=""
            width={800}
            height={300}
          />
        ) : null}
        <BlogView content={content} />
        <Separator className=" my-5" />
        <TopicList topics={blog.topics} />
      </div>
    </div>

  );
};
