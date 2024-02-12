"use client";
import React from "react";
import { LibraryBig, PenSquare } from "lucide-react";
import { UserButton, useAuth } from "@clerk/nextjs";
import { Button, buttonVariants } from "./ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const { userId } = useAuth();
  const pathname = usePathname();
  return (
    <nav className=" flex items-center justify-between px-28 py-3">
      <div className=" flex items-center">
        <LibraryBig size="40px" stroke="#3972EC" />
        <p className=" font-bold text-slate-800 text-xl pl-2">Blog</p>
      </div>
      <div className=" flex gap-5">
        {!(pathname === "/sign-in" || pathname === "/sign-up") && !userId ? (
          <Button>
            <Link href="/sign-in">Login</Link>
          </Button>
        ) : null}

        <Link
          href="/blog/create"
          className={cn(buttonVariants, "flex justify-center items-center mx-2 px-2 py-1 rounded-md bg-slate-800 text-white hover:bg-slate-900 cursor-pointer")}
        >
          <p className=" text-md font-semibold">Write</p>
          <span className=" pl-2">
            <PenSquare />
          </span>
        </Link>

        {userId ? (
          <UserButton afterSignOutUrl="/sign-in">
            <UserButton.UserProfileLink
              label="Blogs"
              url="/me/blogs"
              labelIcon={<PenSquare width={16} height={16} />}
            />
          </UserButton>
        ) : null}
      </div>
    </nav>
  );
};

export default Navbar;
