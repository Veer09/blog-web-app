"use client";

import { supabase } from "@/lib/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { redirect } from "next/navigation";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { toast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { handleClientError } from "@/lib/error";
import { v4 as uuidv4 } from 'uuid';

export const bookForm = z.object({
  name: z.string().min(3, "Title must be more than 3 letters!!"),
  description: z.string().min(5, "Title must be more than 5 letters!!"),
  topic: z.string().min(1, "Please Selct any topic!!"),
  coverImage: z.any(),
});

interface BookDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
}

const BookDialog: FC<BookDialogProps> = ({ isDialogOpen, setIsDialogOpen }) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof bookForm>>({
    resolver: zodResolver(bookForm),
    defaultValues: {
      name: "",
      description: "",
      topic: "",
      coverImage: undefined,
    },
  });

  const fileRef = form.register("coverImage");

  const bookCreate = async (values: z.infer<typeof bookForm>) => {
    try {

      const fileType = values.coverImage[0]
        ? values.coverImage[0].type.split("/")
        : undefined;
      let url;
      if (fileType) {
        const { data, error } = await supabase.storage
          .from("Blog-Images")
          .upload(`${uuidv4()}.${fileType[1]}`, values.coverImage?.[0]);
        url = data?.fullPath;
        if (error) {
          toast({
            variant: "destructive",
            title: "Something went wrong!!",
            description:
              "Book created successfully but Cover Image is not loaded! Please Update it later!!",
          });
        }
      }
      const response = await axios.post(`/api/book`, {
        name: values.name,
        description: values.description,
        topic: values.topic,
        url: url
      });

      form.reset();
      setIsDialogOpen(false);
      router.replace(`/book/create/${response.data.id}`);
    } catch (err: any) {
      handleClientError(err);
    }
  };
  return (
    <DialogContent className="max-w-fit max-h-fit">
      <DialogTitle>Create Book</DialogTitle>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(bookCreate)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Topic" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="coverImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      {...fileRef}
                      onChange={(e) => {
                        field.onChange(e.target.files?.[0]);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </DialogContent>
  );
};

export default BookDialog;
