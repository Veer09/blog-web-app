"use client";
import { Button } from "@/components/ui/button";
import { FC, useState } from "react";

import ChapterCreate, { ChapterType } from "@/components/book/ChapterCreate";
import DialogDetails, { DialogType } from "@/components/book/DialogDetails";
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Chapter, chapterListSchema } from "@/type/book";
import axios from "axios";
import {
  Package2Icon,
  PlusIcon
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";



const Page: FC<{ params: { id: string } }> = ({params}) => {

  const saveContent = async () => {
    try {
      const payload = chapterListSchema.safeParse(content);
      if(!payload.success) return;
      const response = await axios.post(`/api/book/${params.id}`, payload.data);
      
    } catch (error) {
      console.error(error);
    }
  }
  const router = useRouter();
  const pathname = usePathname();
  const [content, setContent] = useState<Chapter[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("");
  return (
    <div className="w-full flex justify-center">
      <div className="grid items-start gap-4 p-4 border rounded-lg min-h-screen w-[70%]">
        <div className="flex flex-col border min-h-screen py-4 px-4 rounded-lg gap-4">
          <div className="flex items-center gap-4">
            <Button
              className="rounded-full w-8 h-8"
              size="icon"
              variant="ghost"
            >
              <Package2Icon className="h-4 w-4" />
              <span className="sr-only">Home</span>
            </Button>
            <h1 className="font-semibold text-lg md:text-2xl">Chapters</h1>
            <Button size="sm" onClick={saveContent}>Save</Button>
            <Dialog
              open={dialogOpen}
              onOpenChange={() => {
                setDialogOpen(!dialogOpen);
                router.push(pathname);
              }}
            >
              <DropdownMenu>
                <DropdownMenuTrigger className="rounded-full ml-auto mr-20 w-8 h-8 flex justify-center items-center">
                  <PlusIcon className="h-4 w-4" />
                  <span className="sr-only">Add chapter</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Select Chapter Type</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      setContent([...content, {
                        create: {
                          blogs: []
                        },
                        title: "",
                        chapterNumber: content.length + 1,
                      }]);
                    }}
                  >
                    Create New Chapter
                  </DropdownMenuItem>
                  <DialogTrigger asChild>
                    <DropdownMenuItem
                      onClick={() => {
                        setDialogType("chapter");
                        setDialogOpen(true);
                      }}
                    >
                      Merge Existing Chapter
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogTrigger
                    asChild
                    onClick={() => {
                      setDialogType("book");
                      setDialogOpen(true);
                    }}
                  >
                    <DropdownMenuItem>Merge Existing Book</DropdownMenuItem>
                  </DialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>
              <DialogDetails
                type={dialogType as DialogType}
                content={content}
                setContent={setContent}
                setDialogOpen={setDialogOpen}
              />
            </Dialog>
          </div>
          <div className="grid gap-4 p-4 border rounded-lg">
            {content.length === 0 ? (
              <h1 className=" text-center">No Chapter Added</h1>
            ) : (
              content.map((_, index: number) => (
                <ChapterCreate
                  key={index}
                  index={index}
                  content={content}
                  setContent={setContent}
                  type={content[index].create ? ChapterType.Create : ChapterType.Link}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;



