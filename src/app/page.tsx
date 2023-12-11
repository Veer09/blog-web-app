import { Button } from "@/components/ui/button";
import { ChevronRight, MoveRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className=" flex flex-col text-center justify-center items-center my-16">
      <p className=" text-4xl  font-bold">
        Welcome To{" "}
        <span className=" border-b-2 border-dashed border-b-slate-500 text-[hsl(var(--primary))]">
          Blog
        </span>{" "}
        <br /> Where you can gain and share your knowledge{" "}
      </p>
      <p className=" text-lg font-semibold text-slate-500 py-3 leading-tight">
        {" "}
        Blog is website where user share their knowledge as blog, and also<br/>
        increase their knowledge by reading other's block{" "}
      </p>
      <Button className=" my-3 font-bold">
        <Link href='#' className=" flex items-center gap-2">Browse Populer Blogs <ChevronRight/></Link>
      </Button>
    </div>
  );
};

export default page;
