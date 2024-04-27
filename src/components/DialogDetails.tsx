import { DialogContent } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import axios from "axios";
import { Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { FC, useState } from "react";
import { Button } from "./ui/button";
import { DialogFooter } from "./ui/dialog";
import { Chapter } from "@/type/book";
import { set } from "zod";

interface DialogDetailsProps {
  type: DialogType;
  content: Chapter[];
  chapterDetails?: { count: number; types: string[] };
  setContent: React.Dispatch<React.SetStateAction<Chapter[]>>;
  setChapterDetails?: React.Dispatch<
    React.SetStateAction<{ count: number; types: string[] }>
  >;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  chapter?: Chapter;
  blogNo?: number;
}

export enum DialogType {
  Book = "book",
  Chapter = "chapter",
  Blog = "blog",
}
const DialogDetails: FC<DialogDetailsProps> = ({
  type,
  content,
  chapterDetails,
  setChapterDetails,
  setContent,
  setDialogOpen,
  chapter,
  blogNo,
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
    // chapter && chapterDetails create subchapter or blog
    if (chapter && chapterDetails && setChapterDetails) {
      // if type is not blog then create subchapter
      if (type !== DialogType.Blog) {
        setChapterDetails((chapter) => {
          return {
            count: chapter.count + 1,
            types: [...chapter.types, type],
          };
        });

        chapter.children.push({
          name:
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
          blogs: [],
          children: [],
        });
        setContent(content);
      }
      // if type is blog then create blog
      else {
        chapter.blogs.push({
          name: blogs[index].title,
          id: blogs[index].id,
        });
        setContent(content);
      }
    }
    // chatpter edit chapter or blog
    else if (chapter) {
      if (type !== DialogType.Blog) {
        chapter.name =
          type === DialogType.Book ? books[index].title : chapters[index].title;
        if (chapter.link) {
          chapter.link.id =
            type === DialogType.Book ? books[index].id : chapters[index].id;
          chapter.link.user_id =
            type === DialogType.Book
              ? books[index].author_id
              : chapters[index].user_id;
        }
        setContent(content);
      } else {
        if (blogNo !== undefined) {
          chapter.blogs[blogNo] = {
            name: blogs[index].title,
            id: blogs[index].id,
          };
        }
        setContent(content);
      }
    }
    // create new chapter
    else if (chapterDetails && setChapterDetails) {
      setChapterDetails((chapter) => {
        return {
          count: chapter.count + 1,
          types: [...chapter.types, type],
        };
      });
      setContent([
        ...content,
        {
          name:
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
          blogs: [],
          children: [],
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
