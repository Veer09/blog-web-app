"use client";
import { Button } from "@/components/ui/button";
import { FC, useState } from "react";
import { CustomError } from "@/type/book";
import { ChapterType } from "@/components/book/ChapterCreate";
import DialogDetails, { DialogType } from "@/components/book/DialogDetails";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Chapter,
  updateBookSchema,
  UpdateDetails,
} from "@/type/book";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Package2Icon, PlusIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import ChapterUpdate from "./ChapterUpdate";
import { toast } from "../ui/use-toast";

interface UpdateBookProps {
  chapters: Chapter[];
  id: string;
}

const UpdateBook: FC<UpdateBookProps> = ({ chapters, id }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [content, setContent] = useState<Chapter[]>(chapters);
  const [updateDetails, setUpdateDetails] = useState<UpdateDetails[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [errIndex, setErrIndex] = useState<number>(-1);


  const { mutate: updateBook } = useMutation({
    mutationFn: async () => {
      const payload = updateBookSchema.safeParse({
        content: content,
        updateDetails: updateDetails,
      });
      console.log(payload); 
      if (!payload.success) throw new Error("Invalid Payload");
      return await axios.put(`/api/book/${id}`, payload.data);
    },
    onError: (error) => {
      if(error instanceof AxiosError){
        if(error.response?.data.index){
          setErrIndex(error.response.data.index);
          toast({
            title: "Error",
            description: error.response.data.error,
            variant: "destructive",
          });
        }
      }

    },
  });

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
            <Button
              size="sm"
              onClick={() => {
                updateBook();
              }}
            >
              Save
            </Button>
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
                      setContent([
                        ...content,
                        {
                          create: {
                            blogs: [],
                          },
                          title: "",
                          chapterNumber: content.length + 1,
                          number: updateDetails.length
                        }
                      ]);
                      setUpdateDetails([
                        ...updateDetails,
                        {
                          number: content.length,
                          customChapter: {
                            create: {
                              blogs: []
                            },
                            title: "",
                            chapterNumber: content.length + 1
                          },
                        }
                      ])
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
                updateDetails={updateDetails}
                setUpdateDetails={setUpdateDetails}
                number={content.length}
              />
            </Dialog>
          </div>
          <div className="grid gap-4 p-4 border rounded-lg">
            {content.length === 0 ? (
              <h1 className=" text-center">No Chapter Added</h1>
            ) : (
              content.map((_, index: number) => (
                <ChapterUpdate
                  key={index}
                  index={index}
                  content={content}
                  setContent={setContent}
                  type={
                    content[index].create ? ChapterType.Create : ChapterType.Link
                  }
                  error = {errIndex === index}
                  setError = {setErrIndex}
                  updateDetails={updateDetails}
                  setUpdateDetails={setUpdateDetails}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateBook;
