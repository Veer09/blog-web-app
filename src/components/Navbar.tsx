"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  Home,
  LineChart,
  Menu,
  Package,
  Package2,
  PenSquare,
  Plus,
  Search,
  ShoppingCart,
  Users,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { bookSchema } from "@/type/book";
import { UserButton, useUser } from "@clerk/nextjs";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

function Navbar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [topic, setTopic] = useState("");
  const router = useRouter();
  const bookCreate = async () => {
    const payload = bookSchema.safeParse({
      name,
      description,
      topic,
      chapters: [],
    });

    if (payload.success) {
      const response = await axios.post("/api/book", payload.data);
      if (response.status === 200) {
        router.push("/book/create/" + response.data.id);
      }
    }
  };
  const { user } = useUser();
  if (!user) return;
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
                href="/dashboard/following"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                  pathname === "/dashboard/following"
                    ? "text-primary bg-muted"
                    : "text-muted-foreground"
                }`}
              >
                <Home className="h-4 w-4" />
                Home Feed
              </Link>
              <Link
                href="/dashboard/topic/"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                  pathname.includes("/dashboard/topic")
                    ? "text-primary bg-muted"
                    : "text-muted-foreground"
                }`}
              >
                <ShoppingCart className="h-4 w-4" />
                Topicwise Feed
              </Link>
              <Link
                href="#"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                  pathname === "/dashboard/roadmap"
                    ? "text-primary bg-muted"
                    : "text-muted-foreground"
                }`}
              >
                <Package className="h-4 w-4" />
                Following Books
              </Link>
              <Link
                href="/dashboard/created-books"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Users className="h-4 w-4" />
                Created Books
              </Link>
              <Link
                href="/me/blogs"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <LineChart className="h-4 w-4" />
                Created Blogs
              </Link>
            </nav>
          </div>
          <div className=" my-10 flex justify-center">
            <Dialog>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Plus
                    color="#ffffff"
                    className=" bg-slate-900 w-10 h-10 p-2 rounded-lg"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Link href="/blog/create">Create Blog</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <DialogTrigger>Create Book</DialogTrigger>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DialogContent>
                <DialogTitle>Create Book</DialogTitle>
                <DialogDescription>
                  <Input
                    type="text"
                    placeholder="Enter Book Name"
                    className="appearance-none bg-background pl-4 shadow-none my-2"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                  />
                  <Input
                    type="text"
                    placeholder="Enter Book Description"
                    className="appearance-none bg-background pl-4 shadow-none my-2"
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                  />
                  <Input
                    type="text"
                    placeholder="Enter Book Topic"
                    className="appearance-none bg-background pl-4 shadow-none my-2"
                    onChange={(e) => setTopic(e.target.value)}
                    value={topic}
                  />
                </DialogDescription>
                <DialogFooter>
                  <Button onClick={bookCreate}>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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

            {user.id ? (
              <UserButton afterSignOutUrl="/sign-in">
                <UserButton.UserProfileLink
                  label="Blogs"
                  url="/me/blogs"
                  labelIcon={<PenSquare width={16} height={16} />}
                />
              </UserButton>
            ) : null}
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Navbar;
