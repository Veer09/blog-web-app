import { ClientError, handleClientError } from "@/lib/error";
import { blogDraftSchema, saveDraftSchema } from "@/type/blog";
import { OutputData } from "@editorjs/editorjs";
import { Draft } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { redirect, useRouter } from "next/navigation";
import { FC, useState } from "react";
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
import { Client } from "@upstash/qstash";

interface DraftButtonProps {
  content: OutputData | undefined
  draft?: Draft
}

const DraftButton: FC<DraftButtonProps> = ({ content, draft }) => {
  const [name, setName] = useState("");
  const router = useRouter();

  const { mutate: draftBlog } = useMutation({
    mutationFn: async () => {
      if (!content) throw new ClientError("Content is required");
      const payload = blogDraftSchema.parse({
        name: name,
        content: content,
      });
      return await axios.post("/api/blog/draft", payload);
    },
    onError: (err: any) => {
      handleClientError(err);
    },
    onMutate: () => {
      toast({
        title: "Saving Draft",
        description: "Please wait while we save your draft",
      });
    },
    onSuccess: () => {
      router.push("/draft");
    },
  });

  const { mutate: saveDraft } = useMutation({
    mutationFn: async () => {
      if (!draft) return;

      const payload = saveDraftSchema.parse({
        content: content,
      });
      return await axios.put(`/api/blog/draft/${draft.id}`, payload);
    },
    onError: (err: any) => {
      handleClientError(err);
    },
    onMutate: () => {
      toast({
        title: "Saving Draft",
        description: "Please wait while we save your draft",
      });
    },
    onSuccess: () => {
      router.push('/draft');
    }
  });

  return (
    !draft ? <Dialog onOpenChange={(open) => {
      if (!open) setName("");
    }}>
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
      : <Button onClick={(e) => {
        e.preventDefault();
        saveDraft();
      }} className=" w-[100px]">Save</Button>
  );
};

export default DraftButton;
