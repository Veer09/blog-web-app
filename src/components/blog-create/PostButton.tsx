"use client";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { handleClientError } from "@/lib/error";
import { cn } from "@/lib/utils";
import { blogUploadSchema } from "@/type/blog";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { XIcon } from "lucide-react";
import { FC, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Badge } from "../ui/badge";
import { Button, buttonVariants } from "../ui/button";
import { FormControl, FormField } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { toast } from "../ui/use-toast";
import { BlogForm, blogFormSchema } from "./Editor";


interface PostButtonProps {
  type: 'upload' | 'update';
  form: UseFormReturn<BlogForm>;
  id: string | undefined;
}

const PostButton: FC<PostButtonProps> = ({ type, form, id }) => {
  const [topicValue, setTopicValue] = useState<string>("");
  const { mutate: upload, isPending: isUploading } = useMutation({
    mutationFn: async () => {
      const data = {
        content: form.getValues('content'),
        title: form.getValues('title'),
        description: form.getValues('description'),
        image: form.getValues('coverImage'),
        topics: form.getValues('topics'),
      };
      const payload = blogFormSchema.parse(data);
      return axios.post("/api/blog", payload);
    },
    onError: (error) => {
      handleClientError(error);
    },
    onMutate: () => {
      toast({
        title: "Uploading Blog",
        description: "Please wait while we upload your blog",
      })
    }
  });

  const { mutate: update } = useMutation({
    mutationFn: async () => {
      const data = {
        content: form.getFieldState('content').isTouched ? form.getValues('content') : undefined,
        title: form.getFieldState('title').isDirty ? form.getValues('title') : undefined,
        description: form.getFieldState('description').isDirty ? form.getValues('description') : undefined,
        image: form.getFieldState('coverImage').isDirty ? form.getValues('coverImage') : undefined,
        topics: form.getFieldState('topics').isTouched ? form.getValues('topics') : undefined,
      };
      const payload = blogUploadSchema.parse(data);
      return axios.put(`/api/blog/${id}`, payload);
    },
    onError: (error) => {
      handleClientError(error);
    },
    onMutate: () => {
      toast({
        title: "Updating Blog",
        description: "Please wait while we update your blog",
      })
    }
  });


  const saveData = () => {
    type === 'update' ? update() : upload();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = topicValue.split(" ").filter((v) => v !== "");
    const updateArray = value.map((v) => v.charAt(0).toUpperCase() + v.slice(1));
    const finalValue = updateArray.join(" ");
    if (e.key === "Enter" || e.key === "Tab" || e.key === "," || (e.key === " " && finalValue[topicValue.length - 1] === " ")) {
      e.preventDefault();
      const regex = /^[0-9a-zA-Z\s-]*$/;
      if (!regex.test(finalValue)) {
        toast({
          title: "Invalid Topic",
          description: "Topic should only contain letters, numbers and spaces",
        })
        return;
      }
      if (!(form.getValues('topics').includes(finalValue))) {
        form.setValue("topics", [...form.getValues('topics'), finalValue]);
        setTopicValue("");
      } else {
        toast({
          title: "Duplicate Topic",
          description: "You have already added this topic",
        })
        setTopicValue("");
      }
    }
  }
  return (
    <div className="">
      <Drawer>
        <DrawerTrigger className={cn(buttonVariants(), "w-[100px]")}>
          Post
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Customize Post</DrawerTitle>
            <DrawerDescription>
              Add title and description about post and add cover image.
            </DrawerDescription>
          </DrawerHeader>
          <div className=" flex w-[70%] justify-center mx-auto gap-4">
            <div className=" flex my-4 gap-5 flex-col justify-center w-[50%] mx-auto">
              <FormField
                name="title"
                control={form.control}
                render={({ field }) => (
                  <FormControl>
                    <Input {...field} placeholder="Add Title" />
                  </FormControl>
                )}
              />
              <FormField
                name="description"
                control={form.control}
                render={({ field }) => (
                  <FormControl>
                    <Textarea {...field} placeholder="Add Description" />
                  </FormControl>
                )}
              />
              <FormField
                name="coverImage"
                control={form.control}
                render={({ field }) => (
                  <FormControl>
                    <Input {...field} placeholder="Add Image URL" />
                  </FormControl>
                )}
              />
            </div>
            <div className=" flex flex-col my-4 w-[50%] ">
              <div>
                <h3 className="text-lg font-semibold">Topics:</h3>
                {
                  form.watch('topics') &&
                  form.getValues('topics').map((topic: string, index) => (
                    <Badge key={topic} className="px-2 py-1 m-1 rounded-full">
                      {topic}
                      <XIcon className="w-4 h-4 ml-1 cursor-pointer" onClick={() => {
                        form.setValue("topics", form.getValues('topics').filter((_, i) => i !== index));
                      }} />
                    </Badge>
                  ))
                }
              </div>
              <FormField
                name="topics"
                control={form.control}
                render={({ field }) => (
                  <FormControl>
                    <Input {...field} onKeyDown={handleKeyDown} value={topicValue} autoComplete={"off"} onChange={(e) => {
                      if (e.target.value.length > 0 && e.target.value[0] === " ") {
                        return;
                      }
                      setTopicValue(e.target.value);
                    }} placeholder="Add Topics" />
                  </FormControl>
                )}
              />
            </div>
          </div>
          <div className=" flex gap-3 justify-center">
            <Button className=" w-[100px]" onClick={saveData} disabled={isUploading}>
              Publish
            </Button>
            <DrawerClose>
              <Button variant="ghost" className=" w-[100px] mb-6">
                Cancel
              </Button>
            </DrawerClose>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default PostButton;
