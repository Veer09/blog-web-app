import React, { Dispatch, FC, SetStateAction } from "react";
import { Input } from "./ui/input";

interface TopicsSearchProps {
  topics: Array<string>;
  setTopics: Dispatch<SetStateAction<string[]>>;

}

const TopicSearch: FC<TopicsSearchProps> = ({ topics, setTopics}) => {
  return (
    <>
      <Input
        placeholder="Add Topics seperated by commas"
        value={topics.join(",")}
        onChange={(e) => {
          setTopics(e.target.value.split(","))
        }}
      />
    </>
  );
};

export default TopicSearch;
