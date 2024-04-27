
import { Input } from "@/components/ui/input";
import { Merge, PlusCircle } from "lucide-react";
import React, { FC, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Chapter } from "@/type/book";
interface ChapterFormProps {
  no: string;
  content: Chapter[];
  setContent: React.Dispatch<React.SetStateAction<Chapter[]>>;
  index: number;
  type: string;
}

const ChapterForm: FC<ChapterFormProps> = ({
  no,
  content,
  setContent,
  index,
  type,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [chapter, setChapter] = useState({
    count: 0,
    types: [] as string[],
  });
  const getChapter = (content: Chapter[]) => {
    const indexs = no.split(".").map(Number).slice(0, -1);
    let obj = content;
    indexs.forEach((index) => {
      obj = obj[index - 1].children;
    });
    return obj[index];
  };
  const handleMergeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const book = content;
    const chapter = getChapter(book);
    chapter.name = e.target.value;
    const params = new URLSearchParams({ name: e.target.value }).toString();
    router.push(pathname + "?" + params);
    const response = await axios.get(`/api/search?${params}`)
    setContent(book);
  };
  const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const book = content;
    const chapter = getChapter(book);
    chapter.name = e.target.value;
    setContent(book);
  };
  return (
    <div className=" gap-3 flex flex-col pl-4">
      <div className="flex gap-2">
        <span className=" font-bold py-1">{no + "."}</span>
        {type === "merge" ? (
          <Input 
            placeholder="Chapter/Book name" 
            onChange={handleMergeChange} 
          />
        ) : (
          <Input
            placeholder="Chapter/Book name"
            onChange={handleCreateChange}
          />
        )}
      </div>

      {Array.from({ length: chapter.count }).map((_, index) => (
        <ChapterForm
          key={index}
          no={no + "." + (index + 1).toString()}
          index={index}
          content={content}
          setContent={setContent}
          type={chapter.types[index]}
        />
      ))}

      {type === "create" && (
        <div className="flex gap-2 justify-between cursor-pointer">
          <div
            className="flex gap-2"
            onClick={() => {
              setChapter((chapter) => {
                return {
                  count: chapter.count + 1,
                  types: [...chapter.types, "create"],
                };
              });
              const obj = {
                name: "",
                type: "create",
                children: [],
              };
              const book = content;
              const chapter = getChapter(book);
              chapter.children = [...chapter.children, obj];
              setContent(book);
            }}
          >
            <PlusCircle />
            <span>Create New Chapter</span>
          </div>
          <div
            className="flex gap-2"
            onClick={() => {
              setChapter((chapter) => {
                return {
                  count: chapter.count + 1,
                  types: [...chapter.types, "merge"],
                };
              });
              const obj = {
                name: "",
                type: "merge",
                children: [],
              };
              const book = content;
              const chapter = getChapter(book);
              chapter.children = [...chapter.children, obj];
              setContent(book);
            }}
          >
            <Merge />
            <span>Merge Existing Chapter or Book</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChapterForm;
