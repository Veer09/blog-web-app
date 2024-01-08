"use client";
import React from "react";
import { LibraryBig, PenSquare } from "lucide-react";
import { UserButton, useAuth } from "@clerk/nextjs";
import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
        {pathname === "/dashboard" ? (
          <Button variant='outline' className=" border-0 ">
            <Link
              href="/blog/create"
              className=" flex justify-center items-center text-[18px]"
            >
              Write
              <span className=" pl-3">
                <PenSquare />
              </span>
            </Link>
          </Button>
        ) : null}
        {userId ? <UserButton afterSignOutUrl="/sign-in">
          <UserButton.UserProfileLink label="Blogs" url="/me/blogs" labelIcon={<PenSquare width={16} height={16}/>}/>
        </UserButton> : null}
      </div>
    </nav>
  );
};

export default Navbar;
