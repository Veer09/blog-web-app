import React, { FC } from "react";
import { OutputData } from "@editorjs/editorjs";
import BlogView from "@/components/BlogView";
import { auth, clerkClient } from "@clerk/nextjs";
import { findBlogById } from "@/lib/blog";
import TopicList from "@/components/TopicList";
import { Separator } from "@/components/ui/separator";
import UserInteraction from "@/components/UserInteraction";
import { isBlogLiked, isBlogSaved } from "@/lib/user";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";



interface Props {
  params: {
    id: string;
  };
}

const page: FC<Props> = async ({ params }) => {
  const blog = await findBlogById(params.id);
  if (!blog) return;
  if (!blog?.comments) return;
  const fullComment = Array.from(
    await Promise.all(
      blog.comments.map(async (comment) => {
        const user = await clerkClient.users.getUser(comment.user_id);
        const obj = {
          ...comment,
          user: {
            firstName: user.firstName,
            lastName: user.lastName,
            imageUrl: user.imageUrl
          }
        };
        return obj;
      })
    )
  );
  const saved = await isBlogSaved(params.id);
  const liked = await isBlogLiked(params.id);
  const likes = blog.like.length;
  if (!blog) return;
  const content = JSON.parse(JSON.stringify(blog.content)) as OutputData;
  const user = await clerkClient.users.getUser(blog.user_id);
  const { userId } = auth();
  return (
    <div className=" flex flex-col items-center m-auto w-[80vw]">
      <div className=" w-[60%]">
        <div className=" flex justify-between">
          <div>
            <p className=" text-4xl text-slate-900 font-bold">{blog.title}</p>
            <p className=" text-gray-600 mb-4 font-semibold">{blog.description}</p>
          </div>
          {(blog.user_id === userId) ? <Link href={`/blog/customize/${blog.id}`} className={cn(buttonVariants())}>Customize</Link> : <></>}
        </div>
        <div className="border-y-2 justify-between flex py-3 my-8 px-3 gap-8 items-center">
          <div className=" flex gap-8 justify-center items-center">
            <img
              src={user.imageUrl}
              className=" w-12 h-12 rounded-[50%]"
              alt="User Image"
            />
            <div>
              <div className=" font-bold text-lg">
                <p>
                  {user.firstName + " " + (user.lastName ? user.lastName : "")}
                </p>
              </div>
              <p className=" ">{blog.createdAt.toDateString()}</p>
            </div>
          </div>
          <div>
            <div className="flex gap-2">
              <UserInteraction
                blogId={blog.id}
                saved={saved}
                comments={fullComment}
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
          />
        ) : null}
        <BlogView content={content} />
        <Separator className=" my-5" />
        <TopicList topics={blog.topics} />
      </div>
    </div>
  );
};

export default page;
