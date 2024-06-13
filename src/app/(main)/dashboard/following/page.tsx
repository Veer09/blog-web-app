import BlogCard from "@/components/BlogCard";
import InfiniteScrollPost from "@/components/InfiniteScrollPost";
import { Separator } from "@/components/ui/separator";
import { getFeedBlogs } from "@/lib/user";
import { FC } from "react";

interface Props {
  params: {
    name: string;
  };
}

const page: FC<Props> = async ({ params }) => {
  const name = decodeURI(params.name);
  const blogs = await getFeedBlogs(1);
  if (!blogs) return;
  return (
    (name === "following") ? <InfiniteScrollPost blogs={blogs} /> : <div>
      {blogs.map((blog, key) => {
        return (
          <div key={key}>
            <BlogCard blog={blog} />
            <Separator />
          </div>
        );
      })}
    </div>
  );
};

export default page;
