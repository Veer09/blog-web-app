"use client";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Blog, Draft } from "@prisma/client";
import { FC, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { EDITOR_TOOLS } from "../../lib/tools";
import { Form, FormControl, FormField } from "../ui/form";
import DraftButton from "./DraftButton";
import PostButton from "./PostButton";

interface EditorProps {
  holder: string;
  blog?: Blog & {
    topics: {
      name: string;
    }[];
  };
  draft?: Draft,
}

export const blogFormSchema = z.object({
  title: z.string(),
  description: z.string(),
  coverImage: z.string(),
  topics: z.array(z.string()),
  content: z.custom<OutputData | undefined>(),
})

export type BlogForm = z.infer<typeof blogFormSchema>;

const isOutputData = (data: any): data is OutputData => {
  return data.blocks !== undefined;
}

const Editor: FC<EditorProps> = ({ holder, blog, draft }) => {
  const ref = useRef<EditorJS>();
  const initialData: BlogForm = {
    title: blog?.title || "",
    description: blog?.description || "",
    coverImage: blog?.coverImage || "",
    topics: blog?.topics.map(t => t.name) || [],
    content: undefined,
  }
  if (blog?.content && isOutputData(blog.content)) {
    initialData.content = blog.content;
  } else if (draft?.content && isOutputData(draft.content)) {
    initialData.content = draft.content;
  }
  
  const form = useForm<BlogForm>({
    defaultValues: initialData,
    resolver: zodResolver(blogFormSchema),
  });

  useEffect(() => {
    if (!ref.current) {
      const editor = new EditorJS({
        holder: holder,
        tools: EDITOR_TOOLS,
        placeholder: "Write your blog here...",
        inlineToolbar: true,
        onChange: async () => {
          const data = await editor.save();
          form.setValue("content", data);
        },
        data: initialData.content,
      });
      ref.current = editor;
    }
    return () => {
      if (ref.current && ref.current.destroy) {
        ref.current.destroy();
      }
    };
  }, []);
  return (
    <Form {...form}>
      <form className="grid grid-cols-[4fr_1fr]">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormControl>
              <div {...field} id={holder} className="prose max-w-full" />
            </FormControl>
          )
          }
        />
        <div className="flex flex-col gap-4">
          <PostButton id={blog?.id} type={blog ? 'update' : 'upload'} form={form} />
          <DraftButton form={form} draft={draft} />
        </div>
      </form>
    </Form>
  );
};
export default Editor;
