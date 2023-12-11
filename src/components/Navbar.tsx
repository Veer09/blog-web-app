'use client'
import React from "react";
import { LibraryBig } from "lucide-react";
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
      {(!(pathname === "/sign-in" || pathname === "/sign-up") && !userId) ? (
        <Button>
          <Link href="/sign-in">Login</Link>
        </Button>
      ) : null}
      {(userId) ? <UserButton afterSignOutUrl="/sign-in"/> : null}
    </nav>
  );
};

export default Navbar;
