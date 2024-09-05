import { handleClientError } from "@/lib/error";
import { blogDraftSchema, saveDraftSchema } from "@/type/blog";
import { Draft } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { redirect } from "next/navigation";
import { FC, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { toast } from "../ui/use-toast";
import { BlogForm } from "./Editor";

interface DraftButtonProps {
  form: UseFormReturn<BlogForm>
  draft? : Draft
}

const DraftButton: FC<DraftButtonProps> = ({ form, draft }) => {
  const [name, setName] = useState("");

  const { mutate: draftBlog } = useMutation({
    mutationFn: async () => {
      const payload = blogDraftSchema.parse({
        name: name,
        content: form.getValues('content'),
      });
      return await axios.post("/api/blog/draft", payload);
    },
    onError: (err: any) => {
      handleClientError(err);
    },
    onSuccess: () => {
      redirect("/draft");
    },
  });

  const { mutate: saveDraft } = useMutation({
    mutationFn: async () => {
      if(!draft) return;
      const payload = saveDraftSchema.parse({
        content: form.getValues('content'),
      });
      return await axios.put(`/api/blog/draft/${draft.id}`, payload);
    },
    onError: (err: any) => {
      handleClientError(err);
    },
    onSuccess: () => {
      toast({
        description: "Draft saved successfully",
      })
    }
  });

  return (
    !draft ? <Dialog>
      <DialogTrigger asChild>
        <Button className=" w-[100px]">Draft</Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-3">
        <DialogTitle>Draft Details</DialogTitle>
        <DialogDescription>
          Save your blog in draft to later publish
        </DialogDescription>
        <Input
          placeholder="Draft name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <DialogFooter>
          <Button onClick={() => draftBlog()}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    : <Button onClick={() => saveDraft()} className=" w-[100px]">Save</Button>
  );
};

export default DraftButton;
