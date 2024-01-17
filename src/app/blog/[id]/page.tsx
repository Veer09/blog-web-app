import React, { FC } from "react";
import prisma from "@/lib/db";
import { OutputData } from "@editorjs/editorjs";
import BlogView from "@/components/blog-post/BlogView";
import { clerkClient, useUser } from "@clerk/nextjs";
import FollowButton from "@/components/general/FollowButton";
import { BookmarkPlus, Heart } from "lucide-react";
import { findBlogById } from "@/lib/blog";
interface Props {
  params: {
    id: string;
  };
}

const page: FC<Props> = async ({ params }) => {
  const blog = await findBlogById(params.id);
  if (!blog) return;
  const content = JSON.parse(JSON.stringify(blog.content)) as OutputData;
  const user = await clerkClient.users.getUser(blog.user_id);
  return (
    <div className=" flex flex-col items-center m-auto w-[80vw]">
      <div className=" w-[60%]">
        <p className=" text-4xl text-slate-900 font-bold">{blog.title}</p>
        <p className=" text-gray-600 mb-4 font-semibold">{blog.description}</p>
        <div className="border-y-2 justify-between flex py-3 my-8 px-3 gap-8 items-center">
          <div className=" flex gap-8 justify-center items-center">
            <img
              src={user.imageUrl}
              className=" w-12 h-12 rounded-[50%]"
              alt="User Image"
            />
            <div>
              <p className=" font-bold text-lg">
                {user.firstName + " " + user.lastName}
              </p>
              <p className=" ">{blog.createdAt.toDateString()}</p>
            </div>
          </div>
          <div>
            <div>
              <BookmarkPlus />
            </div>
          </div>
        </div>
        {blog.coverImage ? <img src={blog.coverImage} className=" m-auto w-[80%] h-[300px] my-10" alt="" /> : null}
        <BlogView content={content} />
      </div>
    </div>
  );
};

export default page;
