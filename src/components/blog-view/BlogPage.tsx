import React, { FC } from "react";
import { OutputData } from "@editorjs/editorjs";
import BlogView from "@/components/blog-view/BlogView";
import { auth } from "@clerk/nextjs";
import { findBlogById } from "@/lib/blog";
import TopicList from "@/components/blog-view/TopicList";
import { Separator } from "@/components/ui/separator";
import UserInteraction from "@/components/blog-view/UserInteraction";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";
import { redis } from "@/lib/redis";
import { cachedUser } from "@/type/user";
import Image from "next/image";
import { isBlogLiked, isBlogSaved, setBlog, setUser } from "@/lib/user";

interface Props {
  id: string;
}

const BlogPage: FC<Props> = async ({ id }) => {
  //Blog
  const getBlog = unstable_cache(
    async () => {
      return await findBlogById(id)
    },
    ["blog", id],
    {
      tags: [`blog:${id}`],
    }
  );

  const blog = await getBlog();
  if (!blog) return notFound();
  
  let user: cachedUser | null = await redis.hgetall(`user:${blog.user_id}`);
  if (!user) {
    user = await setUser(blog.user_id);
    if(!user) return notFound()
  };

  let likes: number | null = await redis.hget(`blog:${blog.id}`, "likes");
  if(!likes) {
    const blogLikes = await setBlog(blog.id);
    if(!blogLikes) return notFound()
    likes = blogLikes.likes;
  };
  const content = JSON.parse(JSON.stringify(blog.content)) as OutputData;

  const { userId } = auth();
  const saved = await isBlogSaved(blog.id);
  const liked = await isBlogLiked(blog.id);
  return (
    <div className=" flex flex-col items-center my-20">
      <div className=" w-[90%]">
        <div className=" flex justify-between">
          <div>
            <p className=" text-4xl text-slate-900 font-bold">{blog.title}</p>
            <p className=" text-gray-600 mb-4 font-semibold">
              {blog.description}
            </p>
          </div>
          {blog.user_id === userId ? (
            <Link
              href={`/blog/customize/${blog.id}`}
              className={cn(buttonVariants())}
            >
              Customize
            </Link>
          ) : (
            <></>
          )}
        </div>
        <div className="border-y-2 justify-between flex py-3 my-8 px-3 gap-8 items-center">
          <div className=" flex gap-8 justify-center items-center">
            <Image
              src={user.imageUrl}
              className=" w-12 h-12 rounded-[50%]"
              alt="User Image"
              width={48}
              height={48}
            />
            <div>
              <div className=" font-bold text-lg">
                <p>
                  {user.firstName + " " + (user.lastName ? user.lastName : "")}
                </p>
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
          <Image
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

export default BlogPage;
