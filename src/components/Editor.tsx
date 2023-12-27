
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import { EDITOR_TOOLS } from "../lib/tools";
import { Button } from "./ui/button";
import axios from "axios";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { blogUploadSchema } from "@/type/blog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { ZodError } from "zod";
import { toast } from "./ui/use-toast";

export default function Editor({
  holder,
  data,
  setData,
}: {
  holder: string;
  data: OutputData | undefined;
  setData: Dispatch<SetStateAction<OutputData | undefined>>;
}) {
  const ref = useRef<EditorJS>();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const queryClient = new QueryClient();
  const { mutate: uplaod } = useMutation({
    mutationFn: async (blog: OutputData) => {
      let update = {
        content: blog,
        title,
        description,
        image
      }
      const payload = blogUploadSchema.parse(update);
      return axios.post("/api/blog/create", payload);
    },
    onError: (error) => {
      if(error instanceof ZodError){
        toast({
          variant: 'destructive',
          content: error.message
        })
      }
    },
    onSuccess: (data) => {
      toast({
        variant: 'default',
        title: "Blog successfully uploaded!!"
      })
      setTitle("");
      setDescription("");
      setImage("");
    }
  });
  useEffect(() => {
    if (!ref.current) {
      const editor = new EditorJS({
        holder: holder,
        tools: EDITOR_TOOLS,
        autofocus: true,
        data: data,
        inlineToolbar: true,
      });
      ref.current = editor;
    }
    return () => {
      if (ref.current && ref.current.destroy) {
        ref.current.destroy();
      }
    };
  }, []);

  const saveData = () => {
    if (!ref.current) return;
    ref.current.save().then(async (data) => {
      uplaod(data);
    });
  };

  return (
    <div>
      <div id={holder} className="prose max-w-full" />
      <div className=" flex justify-center">
        <Drawer>
          <DrawerTrigger>
            <Button className=" w-[100px]">Post</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Customize Post</DrawerTitle>
              <DrawerDescription>
                Add title and description about post and add cover image.
              </DrawerDescription>
            </DrawerHeader>
            <div className=" flex my-4 gap-5 flex-col justify-center items-center w-[50%] mx-auto">
              <Input placeholder="Add Title" value={title} onChange={(e) => setTitle(e.target.value)} required/>
              <Textarea placeholder="Add Description" value={description} onChange={(e) => setDescription(e.target.value)}/>
              <Input placeholder="Add Image URL" value={image} onChange={(e) => setImage(e.target.value)}/>
              <div className=" flex gap-3">
                <Button className=" w-[100px]" onClick={saveData}>
                  Publish
                </Button>
                <DrawerClose>
                  <Button variant="ghost" className=" w-[100px] mb-6">Cancel</Button>
                </DrawerClose>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}
