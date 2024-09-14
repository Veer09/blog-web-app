"use client";
import {
  AlbumIcon,
  BookPlus,
  FilePlus2,
  File,
  Home,
  Menu,
  Package,
  Package2,
  Search,
  ShoppingCart,
  Users
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SignedIn, SignedOut, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import CreateSelection from "./CreateSelection";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

function Navbar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const user = useUser();
  if (!user.isLoaded) return null;
  return (
    <div className="grid h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r md:block">
        <div className="flex h-full max-h-screen flex-col">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              <span className="">Blog</span>
            </Link>
          </div>
          <div className="flex-1 my-8">
            <nav className="grid gap-4 items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="/dashboard/following/"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${pathname.includes("/dashboard/topic") ||
                  pathname === "/dashboard/following"
                  ? "text-primary bg-muted"
                  : "text-muted-foreground"
                  }`}
              >
                <Home className="h-4 w-4" />
                Home Feed
              </Link>
              <Link
                href="/dashboard/followed-books"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${pathname === "/dashboard/followed-books"
                  ? "text-primary bg-muted"
                  : "text-muted-foreground"
                  }`}
              >
                <AlbumIcon className="h-4 w-4" />
                Followed Books
              </Link>
              <Link
                href="/dashboard/created-books"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${pathname === "/dashboard/created-books"
                  ? "text-primary bg-muted"
                  : "text-muted-foreground"
                  }`}
              >
                <BookPlus className="h-4 w-4" />
                Created Books
              </Link>
              <Link
                href="/me/blogs"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${pathname === "/me/blogs"
                  ? "text-primary bg-muted"
                  : "text-muted-foreground"
                  }`}
              >
                <FilePlus2 className="h-4 w-4" />
                Created Blogs
              </Link>
              <Link
                href="/draft"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${pathname === "/draft"
                  ? "text-primary bg-muted"
                  : "text-muted-foreground"
                  }`}
              >
                <File className="h-4 w-4" />
                Drafted Blogs
              </Link>
            </nav>
          </div>
          <div className=" my-10 flex justify-center">
            <CreateSelection />
          </div>
        </div>
      </div>

      <div className="flex flex-col max-h-screen">
        <header className="flex h-14 items-center gap-4 border-b px-4 lg:min-h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <Package2 className="h-6 w-6" />
                  <span className="sr-only">Blog</span>
                </Link>
                <Link
                  href="/dashboard/following"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  Home Feed
                </Link>
                <Link
                  href="/dashboard/topic/Hello"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Topicwise Feed
                </Link>
                <Link
                  href="/dashboard/created-books"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Package className="h-5 w-5" />
                  Created Books
                </Link>
                <Link
                  href="/me/blogs"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Users className="h-5 w-5" />
                  Created Blogs
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex mx-12 justify-between">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search Blogs..."
                  className="w-full appearance-none bg-background pl-8 shadow-none"
                />
              </div>
            </form>
            <SignedIn>
              <DropdownMenu>
                <DropdownMenuTrigger>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user?.imageUrl} />
                      <AvatarFallback>{user.user?.fullName}</AvatarFallback>
                   </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/me" className=" cursor-pointer">
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <SignOutButton>
                      Logout
                    </SignOutButton>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SignedIn>
            <SignedOut>
              <SignInButton>
                <Button>Sign In</Button>
              </SignInButton>
            </SignedOut>
          </div>
        </header>
        <main className="flex flex-1 h-full flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <ScrollArea className="h-[calc(100vh-88px)] lg:h-[calc(100vh-92px)]">
            {children}
          </ScrollArea>
        </main>
      </div>
    </div>
  );
}

export default Navbar;
