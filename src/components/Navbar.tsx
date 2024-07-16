"use client";
import {
  AlbumIcon,
  Bell,
  BookPlus,
  FilePlus2,
  Home,
  LineChart,
  Menu,
  Package,
  Package2,
  PenSquare,
  Search,
  ShoppingCart,
  Users
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { UserButton, useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import CreateSelection from "./CreateSelection";
import { ScrollArea } from "./ui/scroll-area";

function Navbar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isSignedIn } = useUser();

  const { user } = useUser();
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              <span className="">Blog</span>
            </Link>
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <div className="flex-1 my-8">
            <nav className="grid gap-4 items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="/dashboard/following/"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                  pathname.includes("/dashboard/topic") ||
                  pathname === "/dashboard/following"
                    ? "text-primary bg-muted"
                    : "text-muted-foreground"
                }`}
              >
                <Home className="h-4 w-4" />
                Home Feed
              </Link>
              <Link
                href="#"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                  pathname === "/dashboard/roadmap"
                    ? "text-primary bg-muted"
                    : "text-muted-foreground"
                }`}
              >
                <AlbumIcon className="h-4 w-4" />
                Followed Books
              </Link>
              <Link
                href="/dashboard/created-books"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                  pathname === "/dashboard/created-books"
                    ? "text-primary bg-muted"
                    : "text-muted-foreground"
                }`}
              >
                <BookPlus className="h-4 w-4" />
                Created Books
              </Link>
              <Link
                href="/me/blogs"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                  pathname === "/me/blogs"
                    ? "text-primary bg-muted"
                    : "text-muted-foreground"
                }`}
              >
                <FilePlus2 className="h-4 w-4" />
                Created Blogs
              </Link>
            </nav>
          </div>
          <div className=" my-10 flex justify-center">
            <CreateSelection/>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
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
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Package className="h-5 w-5" />
                  Following Roadmaps
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Users className="h-5 w-5" />
                  Customers
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <LineChart className="h-5 w-5" />
                  Analytics
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex mx-7 justify-between">
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

            {user ? (
              <UserButton afterSignOutUrl="/sign-in">
                <UserButton.UserProfileLink
                  label="Blogs"
                  url="/me/blogs"
                  labelIcon={<PenSquare width={16} height={16} />}
                />
              </UserButton>
            ) : (
              <Link href="/sign-in">
                <Button>Login</Button>
              </Link>
            )}
          </div>
        </header>
        <main className="flex overflow-y-scroll flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <ScrollArea className="h-[calc(100vh-56px)]">{children}</ScrollArea>
        </main>
      </div>
    </div>
  );
}

export default Navbar;
