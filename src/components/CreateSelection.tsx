"use client";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import BookDialog from "./book/BookDialog";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const CreateSelection = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={() => {
        setIsDialogOpen(!isDialogOpen);
      }}
    >
      <DropdownMenu>
        <DropdownMenuTrigger className="bg-primary text-primary-foreground rounded-[--radius]"> 
          <Plus
            className="w-10 h-10 p-2"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <Link href="/blog/create">Create Blog</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <DialogTrigger
              onClick={() => {
                setIsDialogOpen(true);
              }}
            >
              Create Book
            </DialogTrigger>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <BookDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />
    </Dialog>
  );
};

export default CreateSelection;
