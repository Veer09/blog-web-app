import { handleClientError } from "@/lib/error";
import { blogDraftSchema, saveDraftSchema } from "@/type/blog";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { redirect } from "next/navigation";
import { FC, MutableRefObject, useState } from "react";
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
import { Draft } from "@prisma/client";
import { toast } from "../ui/use-toast";

interface DraftButtonProps {
  data: OutputData | undefined;
  draft? : Draft
}

const DraftButton: FC<DraftButtonProps> = ({ data, draft }) => {
  const [name, setName] = useState("");
  const { mutate: draftBlog } = useMutation({
    mutationFn: async (data: OutputData) => {
      const payload = blogDraftSchema.parse({
        name: name,
        content: data,
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
    mutationFn: async (data: OutputData) => {
      if(!draft) return;
      const payload = saveDraftSchema.parse({
        content: data,
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

  const setDraft = () => {
    if(!data) return;
    draftBlog(data);
  };

  const save = () => {
    if(!data) return;
    saveDraft(data)
  }
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
          <Button onClick={setDraft}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    : <Button onClick={save} className=" w-[100px]">Save</Button>
  );
};

export default DraftButton;
