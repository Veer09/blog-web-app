import { Chapter, UpdateDetails } from "@/type/book";
import { BookOpenIcon, File, FileEditIcon, PlusIcon, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { FC, useEffect, useRef, useState } from "react";
import DialogDetails, { DialogType } from "./DialogDetails";
import { Button } from "./ui/button";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { set } from "zod";

interface ChapterUpdateProps {
  type?: ChapterType;
  content: Chapter[];
  setContent: React.Dispatch<React.SetStateAction<Chapter[]>>;
  updateDetails: UpdateDetails[];
  setUpdateDetails: React.Dispatch<React.SetStateAction<UpdateDetails[]>>;
  index: number;
  blogNo?: number;
  error?: boolean;
  setError?: React.Dispatch<React.SetStateAction<number>>;
}

export enum ChapterType {
  Link = "link",
  Blog = "blog",
  Create = "create",
}

const ChapterUpdate: FC<ChapterUpdateProps> = ({
  type,
  content,
  setContent,
  index,
  blogNo,
  updateDetails,
  setUpdateDetails,
  error,
  setError
}) => {
  const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    data[index].title = e.target.value;
    setContent(data);
    const newUpdateDetails = [...updateDetails];
    newUpdateDetails[data[index].number!].customChapter!.title = e.target.value;
    setUpdateDetails(newUpdateDetails);
  };

  const removeItem = () => {
    if (type !== ChapterType.Blog) {
      if(data[index].number !== undefined){
        //Already Updated so remove all from it and add removeChapter
        if(!updateDetails[data[index].number].customChapter){
          const newUpdateDetails = [...updateDetails];
          newUpdateDetails[data[index].number] = {
            number: -1,
            removeChapter: {
              id: data[index].link!.id,
              chapterNumber: data[index].chapterNumber,
              type: data[index].link!.type === "book" ? "book" : "chapter",
            }
          }
          setUpdateDetails(newUpdateDetails);
        }
        //Custom Chapter so remove from updateDetails
        else{
          const newUpdateDetails = [...updateDetails]
          newUpdateDetails.splice(data[index].number, 1);
          setUpdateDetails(newUpdateDetails);
        }
      }
      //Not Updated so add removeChapter
      else{
        setUpdateDetails([...updateDetails, {
          number: -1,
          removeChapter: {
            id: data[index].link!.id,
            chapterNumber: data[index].chapterNumber,
            type: data[index].link!.type === "book" ? "book" : "chapter",
          }
        }])
      }
      data.splice(index, 1);
    } else if (data[index].create && blogNo !== undefined) {
      if(data[index].number !== undefined){
        const newUpdateDetails = [...updateDetails];
        //Already have removeBlog so add to it
        if(newUpdateDetails[data[index].number].removeBlog){
          newUpdateDetails[data[index].number].removeBlog!.id.push(data[index].create.blogs[blogNo].id,);
        }
        //Customchapter so remove that blog from blogs
        else if(newUpdateDetails[data[index].number].customChapter){
          newUpdateDetails[data[index].number].customChapter!.create!.blogs.splice(blogNo, 1);
        }
        //Already Updated for other thing so add removeBlog
        else{
          newUpdateDetails[data[index].number] = {
            number: content.length,
            removeBlog:{
              id: [data[index].create.blogs[blogNo].id],
              chapter: data[index].link!.id
            }
          }
        }
        setUpdateDetails(newUpdateDetails);
      }
      //First update so push to updateDetails
      else{
        setUpdateDetails([...updateDetails, {
          number: index,
          removeBlog: {
            id: [data[index].create.blogs[blogNo].id],
            chapter: data[index].link!.id
          }
        }])
        data[index].number = updateDetails.length;
      }
      data[index].create.blogs.splice(blogNo, 1);
    }
    if(error && setError){
      setError(-1)
    }
    setContent(data);
  };
  const data = [...content];
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
                  //First time Update
                  if (data[index].number === undefined) {
                    setUpdateDetails([
                      ...updateDetails,
                      {
                        number: index,
                        updateChapterNumber: {
                          chapterNumber: parseInt(e.target.value),
                          id: data[index].link!.id,
                          type:
                            data[index].link!.type === "book"
                              ? "book"
                              : "chapter",
                        },
                      },
                    ]);
                    data[index].number = updateDetails.length;
                    setContent(data);
                  } else {
                    //Already has updateChapterNumber so update it
                    if (updateDetails[data[index].number].updateChapterNumber) {
                      const newUpdateDetails = [...updateDetails];
                      newUpdateDetails[
                        data[index].number
                      ].updateChapterNumber!.chapterNumber = parseInt(
                        e.target.value
                      );
                      setUpdateDetails(newUpdateDetails);
                    } 
                    //Already has customChapter so update chapterNumber in it
                    else if (
                      updateDetails[data[index].number].customChapter
                    ) {
                      const newUpdateDetails = [...updateDetails];
                      newUpdateDetails[
                        data[index].number
                      ].customChapter!.chapterNumber = parseInt(e.target.value);
                      setUpdateDetails(newUpdateDetails);
                    }
                    //Updated for other thing so add updateChapterNumber
                    else{
                      const newUpdateDetails = [...updateDetails];
                      newUpdateDetails[data[index].number] = {
                        ...newUpdateDetails[data[index].number],
                        updateChapterNumber: {
                          chapterNumber: parseInt(e.target.value),
                          id: data[index].link!.id,
                          type:
                            data[index].link!.type === "book"
                              ? "book"
                              : "chapter",
                        },
                      }
                    }
                  }
                }}
              />
            </>
          )}
          {type === ChapterType.Blog && <File className="h-6 w-6" />}

          <Input
            className={`min-w-0 flex-1 ${error ? "border-red-500 border-2" : ""}`}
            placeholder="Chapter title"
            type="text"
            onChange={handleCreateChange}
            value={
              (type === ChapterType.Blog &&
                data[index].create?.blogs[blogNo!].title) ||
              (type === ChapterType.Create && data[index].title) ||
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
                  type === ChapterType.Blog
                    ? DialogType.Blog
                    : data[index].link!.type === "book"
                    ? DialogType.Book
                    : DialogType.Chapter
                }
                number={index}
                content={data}
                setContent={setContent}
                setDialogOpen={seteditDialogOpen}
                chapter={data[index]}
                blogNo={blogNo}
                updateDetails={updateDetails}
                setUpdateDetails={setUpdateDetails}
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
                number={index}
                type={DialogType.Blog}
                content={content}
                setContent={setContent}
                setDialogOpen={setDialogOpen}
                chapter={data[index]}
                setUpdateDetails={setUpdateDetails}
                updateDetails={updateDetails}
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
          data[index].create.blogs.map((blog, temp) => (
            <ChapterUpdate
              key={temp}
              type={ChapterType.Blog}
              content={content}
              setContent={setContent}
              index={index}
              blogNo={temp}
              updateDetails={updateDetails}
              setUpdateDetails={setUpdateDetails}
            />
          ))}
      </div>
    </div>
  );
};

export default ChapterUpdate;
