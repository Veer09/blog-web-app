"use client";

import { handleClientError } from "@/lib/error";
import { supabase } from "@/lib/supabase";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, FC, SetStateAction } from "react";
import { UseFormReturn } from "react-hook-form";
import { v4 as uuidv4 } from 'uuid';
import { z } from "zod";
import { bookForm } from "../CreateSelection";
import { Button } from "../ui/button";
import {
  DialogContent,
  DialogTitle
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
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { toast } from "../ui/use-toast";


interface BookDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
  form: UseFormReturn<z.infer<typeof bookForm>>;
}

const BookDialog: FC<BookDialogProps> = ({ isDialogOpen, setIsDialogOpen, form }) => {
  const router = useRouter();

  const fileRef = form.register("coverImage");

  const bookCreate = async (values: z.infer<typeof bookForm>) => {
    try {
      const fileType = values.coverImage
        ? values.coverImage[0].type.split("/")
        : undefined;
      if (fileType) {
        const { data, error } = await supabase.storage
          .from("Blog-Images")
          .upload(`${uuidv4()}.${fileType[1]}`, values.coverImage?.[0]);
        if (error) {
          toast({
            variant: "destructive",
            title: "Something went wrong!!",
            description:
              "There was an error uploading the image. Please try again later.",
          });
          return;
        }
        form.setValue("coverImageUrl", data.fullPath);
      }
      const response = await axios.post(`/api/book`, {
        name: values.name,
        description: values.description,
        topic: values.topic,
        url: values.coverImage ? values.coverImageUrl : undefined,
        darkText: values.darkText
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
          <form onSubmit={form.handleSubmit(bookCreate)} className="flex gap-4">
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="coverImageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preview</FormLabel>
                    <FormControl>
                      <div className="relative border rounded-lg aspect-square">
                        <Image
                          alt="Book Cover"
                          className="w-[250px] h-[300px] rounded-lg"
                          src={form.watch('coverImageUrl')}
                          width={200}
                          height={200}
                        />
                        <div className={`absolute w-full top-3 gap-4 flex flex-col ${form.watch("darkText") ? 'text-black' : 'text-white'} p-4`}>
                          <h2 className="font-bold overflow-hidden text-ellipsis whitespace-nowrap text-2xl leading-tight line-clamp-2">
                            {form.watch("name")}
                          </h2>
                          <h2 className="font-bold text-sm break-words leading-tight">
                            {form.watch("description")}
                          </h2>
                          <h2 className="font-bold mt-4 text-sm break-words leading-tight">
                            {form.watch("topic")}
                          </h2>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customImage"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Switch onCheckedChange={() => {
                          if (form.watch("customImage")) {
                            form.setValue("coverImageUrl", "/placeholder.png");
                            form.setValue("coverImage", undefined);
                          }
                          field.onChange(!form.watch("customImage"));
                        }} checked={field.value} id="custom-image" />
                        <Label htmlFor="custom-image">Custom Image</Label>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="darkText"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Switch onCheckedChange={field.onChange} checked={field.value} id="dark-text" />
                        <Label htmlFor="dark-text">Dark Text</Label>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-4">
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
                        disabled={!form.watch("customImage")}
                        {...fileRef}
                        onChange={(e) => {
                          if (!e.target.files) return;
                          field.onChange(e.target.files[0]);
                          const file = e.target.files[0];
                          const reader = new FileReader();
                          reader.readAsDataURL(file);
                          reader.onloadend = () => {
                            form.setValue("coverImageUrl", reader.result as string);
                          };
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
      </div>
    </DialogContent>
  );
};

export default BookDialog;
