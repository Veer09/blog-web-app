import { BookOpenIcon, File, FileEditIcon, PlusIcon } from "lucide-react";
import React, { FC, useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Chapter } from "@/type/book";
import { Dialog, DialogTrigger } from "./ui/dialog";
import DialogDetails, { DialogType } from "./DialogDetails";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { usePathname, useRouter } from "next/navigation";

interface ChapterCreateProps {
  type: string;
  content: Chapter[];
  setContent: React.Dispatch<React.SetStateAction<Chapter[]>>;
  indexArray: number[];
  blogNo?: number;
}

const ChapterCreate: FC<ChapterCreateProps> = ({
  type,
  content,
  setContent,
  indexArray,
  blogNo,
}) => {
  const getChapter = (content: Chapter[]) => {
    let obj = content;
    indexArray.slice(0, -1).forEach((index) => {
      obj = obj[index].children;
    });
    return obj[indexArray[indexArray.length - 1]];
  };
  // console.log(content)
  const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    chapter.current.name = e.target.value;
    setContent(content);
  };

  const [chapterDetails, setChapterDetails] = useState({
    count: 0,
    types: [] as string[],
  });

  const chapter = useRef(getChapter(content));
  const [name, setName] = useState("");
  const [editdialogOpen, seteditDialogOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<DialogType>();
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div className="flex ml-4 items-center gap-2">
      {/* <BookOpenIcon className="h-6 w-6" />
      <h2 className="font-semibold text-lg">Chapter 1: The Beginning</h2>
      <Button className="rounded-full ml-auto" size="icon" variant="outline">
        <FileEditIcon className="h-4 w-4" />
        <span className="sr-only">Edit chapter</span>
      </Button>
      <Button className="rounded-full" size="icon" variant="outline">
        <PlusIcon className="h-4 w-4" />
        <span className="sr-only">Add subchapter</span>
      </Button> */}
      <div className="grid gap-2 w-full">
        <div className="flex items-center gap-2">
         {type !== DialogType.Blog && <BookOpenIcon className="h-6 w-6" />}
         {type === DialogType.Blog && <File className="h-6 w-6" />}
         <Input
            className="min-w-0 flex-1"
            placeholder="Chapter title"
            type="text"
            onChange={handleCreateChange}
            value={(type === "create" ? name : (type === DialogType.Blog && blogNo !== undefined) ? chapter.current.blogs[blogNo].name : chapter.current.name) as string}
            disabled={
              type === DialogType.Book ||
              type === DialogType.Chapter ||
              type === DialogType.Blog
            }
          />
          {type !== "create" && (
            <Dialog
              open={editdialogOpen}
              onOpenChange={() => seteditDialogOpen(!editdialogOpen)}
            >
              <DialogTrigger asChild>
                <Button className="rounded-full" size="icon" variant="outline">
                  <FileEditIcon className="h-4 w-4" />
                  <span className="sr-only">Edit chapter</span>
                </Button>
              </DialogTrigger>
              {/* edit dialog */}
              <DialogDetails
                type={type as DialogType}
                content={content}
                setContent={setContent}
                setDialogOpen={seteditDialogOpen}
                chapter={chapter.current}
                blogNo={blogNo}
              />
            </Dialog>
          )}
          {type === "create" && (
            <Dialog
              open={dialogOpen}
              onOpenChange={() => {
                setDialogOpen(!dialogOpen);
                router.push(pathname);
              }}
            >
              <DropdownMenu>
                <DropdownMenuTrigger className="rounded-full ml-auto w-8 h-8 flex justify-center items-center">
                  <PlusIcon className="h-4 w-4" />
                  <span className="sr-only">Add subchapter/Blog</span>
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
                      chapter.current.children = [
                        ...chapter.current.children,
                        { name: "", children: [], blogs: [] },
                      ];
                    }}
                  >
                    Create New Chapter
                  </DropdownMenuItem>
                  <DialogTrigger asChild>
                    <DropdownMenuItem
                      onClick={() => {
                        setDialogType(DialogType.Chapter);
                        setDialogOpen(true);
                      }}
                    >
                      Merge Existing Chapter
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogTrigger
                    asChild
                    onClick={() => {
                      setDialogType(DialogType.Book);
                      setDialogOpen(true);
                    }}
                  >
                    <DropdownMenuItem>Merge Existing Book</DropdownMenuItem>
                  </DialogTrigger>
                  <DialogTrigger
                    asChild
                    onClick={() => {
                      setDialogType(DialogType.Blog);
                      setDialogOpen(true);
                    }}
                  >
                    <DropdownMenuItem>Add Blog</DropdownMenuItem>
                  </DialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>
              {/* subchapter create dialog */}
              <DialogDetails
                type={dialogType as DialogType}
                content={content}
                chapterDetails={chapterDetails}
                setContent={setContent}
                setChapterDetails={setChapterDetails}
                setDialogOpen={setDialogOpen}
                chapter={chapter.current}
              />
            </Dialog>
          )}
        </div>
        
        {type !== DialogType.Blog && chapter.current.children.map((subchapter, index) => (
          <ChapterCreate
            key={index}
            type={chapterDetails.types[index]}
            content={content}
            setContent={setContent}
            indexArray={[...indexArray, index]}
          />
        ))}
        {type !== DialogType.Blog && chapter.current.blogs.map((blog, index) => (
          <ChapterCreate
            key={index}
            type={DialogType.Blog}
            content={content}
            setContent={setContent}
            indexArray={[...indexArray]}
            blogNo={index}
          />
        ))}
        {/* <div className="grid gap-2 ml-8">
          <div className="flex items-center gap-2">
          <BookOpenIcon className="h-6 w-6" />
          <Input
          className="min-w-0 flex-1"
          defaultValue="About this book"
          placeholder="Chapter title"
          type="text"
          />
          <Button
          className="rounded-full ml-auto"
          size="icon"
          variant="outline"
          >
          <FileEditIcon className="h-4 w-4" />
                  <span className="sr-only">Edit chapter</span>
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <BookOpenIcon className="h-6 w-6" />
                <Input
                  className="min-w-0 flex-1"
                  defaultValue="How to use this book"
                  placeholder="Chapter title"
                  type="text"
                />
                <Button
                  className="rounded-full ml-auto"
                  size="icon"
                  variant="outline"
                >
                  <FileEditIcon className="h-4 w-4" />
                  <span className="sr-only">Edit chapter</span>
                </Button>
              </div>
            </div> */}
      </div>
    </div>
  );
};

export default ChapterCreate;
