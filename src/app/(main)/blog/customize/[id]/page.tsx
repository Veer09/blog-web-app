import { getBlogById } from "@/lib/blog";
import { unstable_cache } from "next/cache";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { FC } from "react";

interface Props {
  params: {
    id: string;
  };
}

const Page: FC<Props> = async ({ params }) => {
  const Editor = dynamic(() => import("@/components/blog-create/Editor"), {
    ssr: false,
  });
  
  const getBlog = unstable_cache(
    async () => {
      return await getBlogById(params.id);
    },
    ["blog", params.id],
    {
      tags: [`blog:${params.id}`],
    }
  );

  const blog = await getBlog();
  if (!blog) return notFound();

  return (
    <div className=" flex flex-col">
      <p className=" text-center font-semibold text-lg">
        Write Your Blog Here:{" "}
      </p>
      <Editor holder={"editor-js"} blog={blog} />
    </div>
  );
};

export default Page;
