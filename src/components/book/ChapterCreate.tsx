import { Chapter } from "@/type/book";
import {
  BookOpenIcon,
  File,
  FileEditIcon,
  PlusIcon,
  X
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { FC, useRef, useState } from "react";
import DialogDetails, { DialogType } from "./DialogDetails";
import { Button } from "../ui/button";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";

interface ChapterCreateProps {
  type?: ChapterType;
  content: Chapter[];
  setContent: React.Dispatch<React.SetStateAction<Chapter[]>>;
  index: number;
  blogNo?: number;
  error?: boolean;
}

export enum ChapterType {
  Link = "link",
  Blog = "blog",
  Create = "create",
}

const ChapterCreate: FC<ChapterCreateProps> = ({
  type,
  content,
  setContent,
  index,
  blogNo,
  error,
}) => {
  const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    data[index].title = e.target.value;
    setContent(data);
  };

  const removeItem = () => {
    if (type !== ChapterType.Blog) {
      data.splice(index, 1);
    } else if (data[index].create !== undefined && blogNo !== undefined) {
      data[index]?.create?.blogs?.splice(blogNo, 1);
    }
    setContent(data);
  };

  const data = [...content]
  const [editdialogOpen, seteditDialogOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div className="flex ml-4 items-center gap-2">
      <div className="grid gap-2 w-full">
        <div className="flex items-center gap-2">
          {type !== ChapterType.Blog && (
            <>
              <BookOpenIcon className="h-6 w-6" />
              <Input
                className="w-12 text-center"
                type="number"
                value={data[index].chapterNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  data[index].chapterNumber = parseInt(e.target.value);
                  setContent(data);
                }}
              />
            </>
          )}
          {type === ChapterType.Blog && <File className="h-6 w-6" />}

          <Input
            className={`min-w-0 flex-1 ${error ? "border-red-500" : ""}`}
            placeholder="Chapter title"
            type="text"
            onChange={handleCreateChange}
            value={
              (type === ChapterType.Blog &&
                data[index].create?.blogs[blogNo!].title) ||
              (type === ChapterType.Create && name) ||
              data[index].title
            }
            disabled={
              data[index].link !== undefined || type === ChapterType.Blog
            }
          />

          {(data[index].link || type === ChapterType.Blog) && (
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
                type={
                  (data[index].link?.type as DialogType) || DialogType.Blog
                }
                content={data}
                setContent={setContent}
                setDialogOpen={seteditDialogOpen}
                chapter={data[index]}
                blogNo={blogNo}
              />
            </Dialog>
          )}

          {data[index].create && type !== ChapterType.Blog && (
            <Dialog
              open={dialogOpen}
              onOpenChange={() => {
                setDialogOpen(!dialogOpen);
                router.push(pathname);
              }}
            >
              <DialogTrigger asChild>
                <Button className="rounded-full" size="icon" variant="outline">
                  <PlusIcon className="h-4 w-4" />
                  <span className="sr-only">Add Blog</span>
                </Button>
              </DialogTrigger>
              {/* blog add dialog */}
              <DialogDetails
                type={DialogType.Blog}
                content={data}
                setContent={setContent}
                setDialogOpen={setDialogOpen}
                chapter={data[index]}
              />
            </Dialog>
          )}
          <div>
            <Button
              className="rounded-full"
              size="icon"
              variant="outline"
              onClick={removeItem}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove Chapter</span>
            </Button>
          </div>
        </div>

        {type !== ChapterType.Blog &&
          data[index].create &&
          data[index]?.create?.blogs?.map((blog, temp) => (
            <ChapterCreate
              key={temp}
              type={ChapterType.Blog}
              content={content}
              setContent={setContent}
              index={index}
              blogNo={temp}
            />
          ))}
      </div>
    </div>
  );
};

export default ChapterCreate;


