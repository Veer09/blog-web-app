"use client";
import { Button } from "@/components/ui/button";
import { FC, useState } from "react";

import ChapterCreate from "@/components/ChapterCreate";
import DialogDetails, { DialogType } from "@/components/DialogDetails";
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
  const [chapterDetails, setChapterDetails] = useState({
    count: 0,
    types: [] as string[],
  });

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
                      setChapterDetails((chapter) => {
                        return {
                          count: chapter.count + 1,
                          types: [...chapter.types, "create"],
                        };
                      });
                      setContent([...content, { name: "", children: [], blogs: [] }]);
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
                chapterDetails={chapterDetails}
                setContent={setContent}
                setChapterDetails={setChapterDetails}
                setDialogOpen={setDialogOpen}
              />
            </Dialog>
          </div>
          <div className="grid gap-4 p-4 border rounded-lg">
            {chapterDetails.count === 0 ? (
              <h1 className=" text-center">No Chapter Added</h1>
            ) : (
              Array.from({ length: chapterDetails.count }).map((_, index: number) => (
                <ChapterCreate
                  key={index}
                  indexArray={[index]}
                  content={content}
                  setContent={setContent}
                  type={chapterDetails.types[index]}
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



