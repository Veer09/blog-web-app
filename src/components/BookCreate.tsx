import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Package2Icon,
  PlusIcon,
  BookOpenIcon,
  FileEditIcon,
} from "lucide-react";

export function BookCreate() {
  return (
    <div className="grid items-start gap-4 p-4 border rounded-lg min-h-screen w-[70%]">
      <div className="flex flex-col border min-h-screen py-4 px-4 rounded-lg gap-4">
        <div className="flex items-center gap-4">
          <Button className="rounded-full w-8 h-8" size="icon" variant="ghost">
            <Package2Icon className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </Button>
          <h1 className="font-semibold text-lg md:text-2xl">Chapters</h1>
          <Button size="sm">Save</Button>
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full ml-auto mr-20 w-8 h-8 flex justify-center items-center">
              <PlusIcon className="h-4 w-4" />
              <span className="sr-only">Add chapter</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Select Chapter Type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Create New Chapter</DropdownMenuItem>
              <DropdownMenuItem>Merge Existing Chapter</DropdownMenuItem>
              <DropdownMenuItem>Merge Existing Book</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="grid gap-4 p-4 border rounded-lg"></div>
      </div>
    </div>
  );
}
