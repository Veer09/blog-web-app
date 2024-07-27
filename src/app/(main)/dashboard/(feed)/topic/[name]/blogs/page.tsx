import BlogCard from "@/components/blog-view/BlogCard";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getBlogByTopic } from "@/lib/topic";
import { Link } from "lucide-react";
import Image from "next/image";
const page = async ({ params }: { params: { name: string } }) => {
  const blogs = await getBlogByTopic(params.name);
  if (blogs.length === 0)
    return (
      <div className="w-[350px] gap-10 h-[300px] mx-[35%] my-[7%] flex flex-col text-xl justify-center font-bold text-center items-center">
        {" "}
        <Image src="/MessyDoodle.svg" height={300} width={300} alt="No Blog"/>
        <div className="flex flex-col gap-4 items-center">
          <div className=" text-2xl font-bold">There is no blog in this topic</div>
          <Link href="/dashborad/following" className={`${buttonVariants()} w-40`}>Write your blog in this topic</Link>
        </div>
      </div>
    );
  return (
    <div>
      {blogs.map((blog, key) => {
        return (
          <div key={key}>
            <BlogCard blog={blog} key={key} />
            <Separator />
          </div>
        );
      })}
    </div>
  );
};

export default page;
