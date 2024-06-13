import { Chapter, UpdateDetails } from "@/type/book";
import axios from "axios";
import { Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { FC, useState } from "react";
import { DialogContent } from "./ui/dialog";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { number, set } from "zod";

interface DialogDetailsProps {
  type: DialogType;
  content: Chapter[];
  setContent: React.Dispatch<React.SetStateAction<Chapter[]>>;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  chapter?: Chapter;
  blogNo?: number;
  updateDetails?: UpdateDetails[];
  setUpdateDetails?: React.Dispatch<React.SetStateAction<UpdateDetails[]>>;
  number?: number;
}

export enum DialogType {
  Book = "book",
  Chapter = "chapter",
  Blog = "blog",
}
const DialogDetails: FC<DialogDetailsProps> = ({
  type,
  content,
  setContent,
  setDialogOpen,
  chapter,
  blogNo,
  updateDetails,
  setUpdateDetails,
  number,
}) => {
  interface Book {
    id: string;
    title: string;
    topic_name: string;
    author_id: string;
    _count: {
      followers: number;
    };
  }
  interface Chapter {
    id: string;
    title: string;
    _count: {
      book: number;
    };
    user_id: string;
  }
  interface Blog {
    id: string;
    title: string;
    _count: {
      like: number;
    };
    user_id: string;
  }
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  const saveContent = (index: number) => {
    //For Update
    if (updateDetails && setUpdateDetails && number !== undefined) {
      //add blog to chapter
      if (chapter && chapter.create && blogNo === undefined) {
        //First Update
        if (chapter.number === undefined) {
          setUpdateDetails([
            ...updateDetails,
            {
              number: number,
              addBlog: {
                chapter: chapter.link!.id,
                id: [blogs[index].id],
              },
            },
          ]);
          chapter.number = updateDetails.length;
        } else {
          const newUpdateDetails = [...updateDetails];
          //If already addBlog exists add to it
          if (updateDetails[chapter.number].addBlog) {
            newUpdateDetails[chapter.number].addBlog!.id.push(blogs[index].id);
          }
          //If customChapter exists add in blogs array
          else if (updateDetails[chapter.number].customChapter) {
            newUpdateDetails[chapter.number].customChapter!.create!.blogs.push({
              id: blogs[index].id,
              title: blogs[index].title,
            });
          }
          //Updated for other thing so add new addBlog
          else {
            newUpdateDetails[chapter.number].addBlog = {
              chapter: chapter.link!.id,
              id: [blogs[index].id],
            };
          }
          setUpdateDetails(newUpdateDetails);
        }
      } else if (chapter && chapter.create && blogNo !== undefined) {
        if (chapter.number === undefined) {
          setUpdateDetails([
            ...updateDetails,
            {
              number: number,
              updateBlog: {
                chapter: chapter.link!.id,
                ids: [
                  {
                    oldId: chapter.create.blogs[blogNo].id,
                    newId: blogs[index].id,
                  },
                ],
              },
            },
          ]);
          chapter.number = updateDetails.length;
        } else {
          const newUpdateDetails = [...updateDetails];
          if (updateDetails[chapter.number].updateBlog) {
            newUpdateDetails[chapter.number].updateBlog!.ids.push({
              oldId: chapter.create.blogs[blogNo].id,
              newId: blogs[index].id,
            });
          } else if (updateDetails[chapter.number].customChapter) {
            newUpdateDetails[chapter.number].customChapter!.create!.blogs[
              blogNo
            ] = {
              id: blogs[index].id,
              title: blogs[index].title,
            };
          } else {
            newUpdateDetails[chapter.number].updateBlog = {
              chapter: chapter.link!.id,
              ids: [
                {
                  oldId: chapter.create.blogs[blogNo].id,
                  newId: blogs[index].id,
                },
              ],
            };
          }
          setUpdateDetails(newUpdateDetails);
        }
      } else if (chapter && chapter.link) {
        if (chapter.number === undefined) {
          setUpdateDetails([
            ...updateDetails,
            {
              number: number,
              updateChapter: {
                newId:
                  type === DialogType.Book
                    ? books[index].id
                    : chapters[index].id,
                oldId: chapter.link.id,
                type: type === DialogType.Book ? "book" : "chapter",
              },
            },
          ]);
          chapter.number = updateDetails.length;
        } else {
          const newUpdateDetails = [...updateDetails];
          if (updateDetails[chapter.number].updateChapter) {
            newUpdateDetails[chapter.number].updateChapter!.newId =
              type === DialogType.Book ? books[index].id : chapters[index].id;
          } else if (updateDetails[chapter.number].customChapter) {
            newUpdateDetails[chapter.number].customChapter!.link!.id =
              type === DialogType.Book ? books[index].id : chapters[index].id;
            newUpdateDetails[chapter.number].customChapter!.link!.user_id =
              type === DialogType.Book
                ? books[index].author_id
                : chapters[index].user_id;
            newUpdateDetails[chapter.number].customChapter!.title =
              type === DialogType.Book
                ? books[index].title
                : chapters[index].title;
          } else {
            newUpdateDetails[chapter.number].updateChapter = {
              newId:
                type === DialogType.Book ? books[index].id : chapters[index].id,
              oldId: chapter.link.id,
              type: type === DialogType.Book ? "book" : "chapter",
            };
          }
          setUpdateDetails(newUpdateDetails);
        }
      } else {
        setUpdateDetails([
          ...updateDetails,
          {
            number: number,
            customChapter: {
              link: {
                id:
                  type === DialogType.Book
                    ? books[index].id
                    : chapters[index].id,
                type: type === DialogType.Book ? "book" : "chapter",
                user_id:
                  type === DialogType.Book
                    ? books[index].author_id
                    : chapters[index].user_id,
              },
              title:
                type === DialogType.Book
                  ? books[index].title
                  : chapters[index].title,
              chapterNumber: content.length + 1,
            },
          },
        ]);
      }
    }

    //add blog to chapter
    if (chapter && chapter.create && blogNo === undefined) {
      chapter.create.blogs.push({
        title: blogs[index].title,
        id: blogs[index].id,
      });
      setContent(content);
    }
    //blog edit of created chapter
    else if (chapter && chapter.create && blogNo !== undefined) {
      chapter.create.blogs[blogNo] = {
        title: blogs[index].title,
        id: blogs[index].id,
      };
      setContent(content);
    }
    //edit of linked chapter or book
    else if (chapter && chapter.link) {
      if (type !== DialogType.Blog) {
        chapter.title =
          type === DialogType.Book ? books[index].title : chapters[index].title;
        chapter.link.id =
          type === DialogType.Book ? books[index].id : chapters[index].id;
        chapter.link.user_id =
          type === DialogType.Book
            ? books[index].author_id
            : chapters[index].user_id;
      }
      setContent(content);
    } else {
      setContent([
        ...content,
        {
          title:
            type === DialogType.Book
              ? books[index].title
              : chapters[index].title,
          link:
            type === DialogType.Book
              ? {
                  id: books[index].id,
                  type: DialogType.Book,
                  user_id: books[index].author_id,
                }
              : {
                  id: chapters[index].id,
                  type: DialogType.Chapter,
                  user_id: chapters[index].user_id,
                },
          chapterNumber: content.length + 1,
          number: updateDetails?.length,
        },
      ]);
    }

    setDialogOpen(false);
    setSearch("");
    router.push(pathname);
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (e.target.value.length < 3) {
      setBooks([]);
      setChapters([]);
      setBlogs([]);
      return;
    }
    const params = new URLSearchParams({
      type: type,
      name: e.target.value,
    }).toString();
    router.push(pathname + "?" + params);
    const response = await axios.get(`/api/search?${params}`);

    if (type === DialogType.Book) setBooks(response.data.books);
    else if (type === DialogType.Chapter) setChapters(response.data.chapters);
    else setBlogs(response.data.blogs);
  };

  return (
    <DialogContent className=" w-full">
      <div className="relative">
        <Search className="absolute left-2.5 top-[18px] h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search Blogs..."
          value={search}
          onChange={handleChange}
          className="appearance-none bg-background pl-8 shadow-none my-2"
        />
      </div>
      <ScrollArea className="max-h-[300px]">
        {type === (DialogType.Book as string) && books.length !== 0
          ? books.map((item: Book, index) => (
              <div
                key={index}
                className="flex items-center my-4 cursor-pointer"
                onClick={() => {
                  saveContent(index);
                }}
              >
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {item.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.topic_name}
                    {item.author_id}
                  </p>
                </div>
                <div className="ml-auto font-medium">
                  {item._count.followers}
                </div>
              </div>
            ))
          : type === DialogType.Book && (
              <h1 className="text-center">No Book Found</h1>
            )}
        {type === DialogType.Chapter && chapters.length !== 0
          ? chapters.map((item: Chapter, index) => (
              <div
                key={index}
                className="flex items-center"
                onClick={() => saveContent(index)}
              >
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {item.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.user_id}
                  </p>
                </div>
                <div className="ml-auto font-medium">{item._count.book}</div>
              </div>
            ))
          : type === DialogType.Chapter && (
              <h1 className="text-center">No Chapter Found</h1>
            )}
        {type === DialogType.Blog && blogs.length !== 0
          ? blogs.map((item: Blog, index) => (
              <div
                key={index}
                className="flex items-center cursor-pointer"
                onClick={() => saveContent(index)}
              >
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {item.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.user_id}
                  </p>
                </div>
                <div className="ml-auto font-medium">{item._count.like}</div>
              </div>
            ))
          : type === DialogType.Blog && (
              <h1 className="text-center">No Blog Found</h1>
            )}
      </ScrollArea>
    </DialogContent>
  );
};

export default DialogDetails;
