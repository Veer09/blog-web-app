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
import { blogSchema, blogUploadSchema } from "@/type/blog";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ZodError } from "zod";
import { EDITOR_TOOLS } from "../../lib/tools";
import TopicSearch from "../TopicSearch";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { toast } from "../ui/use-toast";

export default function Editor({
  holder,
  id,
  blog,
}: {
  holder: string;
  id?: string;
  blog: {
    title: string;
    description: string;
    content: unknown;
    coverImage: string;
    topics: {
      name: string;
    }[];
  } | null;
}) {
  const ref = useRef<EditorJS>();
  const [title, setTitle] = useState(blog?.title || "");
  const [description, setDescription] = useState(blog?.description || "");
  const [image, setImage] = useState("");
  const topicArray = blog?.topics.map((topic) => topic.name) || [];
  const [topics, setTopics] = useState<Array<string>>(topicArray);
  const router = useRouter();

  const { mutate: uplaod } = useMutation({
    mutationFn: async (blog: OutputData) => {
      let update = {
        content: blog,
        title,
        description,
        image,
        topics,
      };
      const payload = blogUploadSchema.parse(update);
      return axios.post("/api/blog", payload);
    },
    onError: (error) => {
      if (error instanceof ZodError || error instanceof AxiosError) {
        toast({
          variant: "destructive",
          title: error.message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Something went wrong",
        });
      }
    },
    onSuccess: (res) => {
      const response = res.data;
      const blog = blogSchema.safeParse(response);
      if (!blog.success) {
        return;
      }
      router.push(`/blog/${blog.data}`);
    },
  });

  const { mutate: update } = useMutation({
    mutationFn: async (blog: OutputData) => {
      let update = {
        content: blog,
        title,
        description,
        image,
        topics,
      };
      const payload = blogUploadSchema.parse(update);
      return axios.put(`/api/blog/${id}`, payload);
    },
    onError: (error) => {
      if (error instanceof ZodError || error instanceof AxiosError) {
        toast({
          variant: "destructive",
          title: error.message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Something went wrong",
        });
      }
    },
    onSuccess: (res) => {
      const response = res.data;
      const blog = blogSchema.safeParse(response);
      if (!blog.success) {
        return;
      }
      router.push(`/blog/${blog.data}`);
    },
  });

  useEffect(() => {
    if (!ref.current) {
      const editor = new EditorJS({
        holder: holder,
        tools: EDITOR_TOOLS,
        data: (blog?.content as OutputData) || {},
        placeholder: "Write your blog here...",
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
      if(!id){
        uplaod(data)
      }else{
        update(data)
      };
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
            <div className=" flex w-[70%] justify-center mx-auto gap-4">
              <div className=" flex my-4 gap-5 flex-col justify-center w-[50%] mx-auto">
                <Input
                  placeholder="Add Title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                  required
                />
                <Textarea
                  placeholder="Add Description"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                />
                <Input
                  placeholder="Add Image URL"
                  value={image}
                  onChange={(e) => {
                    setImage(e.target.value);
                  }}
                />
              </div>
              <div className=" flex my-4 w-[50%] ">
                <TopicSearch
                  topics={topics}
                  setTopics={setTopics}
                />
              </div>
            </div>
            <div className=" flex gap-3 justify-center">
              <Button className=" w-[100px]" onClick={saveData}>
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
    </div>
  );
}
