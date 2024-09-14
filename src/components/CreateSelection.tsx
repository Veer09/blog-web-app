"use client";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import BookDialog from "./book/BookDialog";
import { Dialog, DialogTrigger } from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const bookForm = z.object({
  name: z.string().min(3, "Title must be more than 3 letters!!").max(20, "Title must be less than 10 letters!!"),
  description: z.string().min(5, "Description must be more than 5 letters!!").max(70, "Description must be less than 100 letters!!"),
  topic: z.string().min(1, "Please Selct any topic!!"),
  coverImage: z.any(),
  coverImageUrl: z.string(),
  customImage: z.boolean(),
  darkText: z.boolean(),
});


const CreateSelection = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const form = useForm<z.infer<typeof bookForm>>({
    resolver: zodResolver(bookForm),
    defaultValues: {
      name: "",
      description: "",
      topic: "",
      coverImage: undefined,
      coverImageUrl: "/placeholder.png",
      customImage: false,
      darkText: false,
    },
  });
  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={() => {
        setIsDialogOpen(!isDialogOpen);
        if (isDialogOpen) {
          form.reset();
        }
      }}
    >
      <DropdownMenu>
        <DropdownMenuTrigger className="bg-primary text-primary-foreground rounded-[--radius]"> 
          <Plus
            className="w-10 h-10 p-2"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <Link href="/blog/create" className=" cursor-pointer">Create Blog</Link>
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
        form={form}
      />
    </Dialog>
  );
};

export default CreateSelection;
