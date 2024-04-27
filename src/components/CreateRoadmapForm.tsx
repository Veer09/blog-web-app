"use client";
import React, { FC, useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import AddRoadmapForm from "./AddRoadmapForm";
import { Content } from "@/app/book/create/[id]/page";
import { set } from "zod";
import { get } from "http";

interface Component {
  type: string;
}

interface CreateRoadmapFormProps {
  level: number;
  content: Content | undefined;
  setContent: (content: Content | undefined) => void;
}

const CreateRoadmapForm: FC<CreateRoadmapFormProps> = ({
  content,
  setContent,
  level,
}) => {
  const [components, setComponents] = useState<Component[]>([]);
  const [roadmapName, setRoadmapName] = useState<string>("");
  const [roadmapTopic, setRoadmapTopic] = useState<string>("");


  const getObject = (content: Content | undefined, level: number): Content => {
    const obj = {
      level: 0,
      type: "create",
      name: roadmapName,
      topic: roadmapTopic,
      children: [],
    }
    if (content === undefined) {
      setContent(obj);
      return obj;
    }
    if (content.level === level) {
      return content;
    }
    for (let child of content.children) {
      if (child.type === "add") {
        continue;
      }
      const obj: null | Content = getObject(child, level);
      if (obj !== null) {
        console.log(323)
        const newObj = {
          level: level + 1,
          type: "create",
          name: roadmapName,
          topic: roadmapTopic,
          children: [],
        };
        setContent({})
        return newObj;
      }
    }
    setContent(obj);
    return obj;
  };
  const trial = getObject(content, level);
  const ref = useRef(trial);
  console.log(ref.current === trial, ref.current, trial)
  return (
    <div className=" gap-3 flex flex-col border-l-4 pl-4">
      <Input
        placeholder="Roadmap Name"
        onChange={(e) => {
          setRoadmapName(e.target.value);
          ref.current.name = e.target.value;
          setContent(content);
        }}
      />
      <Input
        placeholder="Roadmap Topic"
        onChange={(e) => {
          setRoadmapTopic(e.target.value);
          ref.current.topic = e.target.value;
          setContent(content);
        }}
      />
      <Separator />
      {components.map((component, index) =>
        component.type === "addRoadmap" ? (
          <AddRoadmapForm key={index} />
        ) : (
          <CreateRoadmapForm
            content={content}
            setContent={setContent}
            level={level}
            key={index}
          />
        )
      )}
      <div className="flex gap-2">
        <Button
          onClick={() => setComponents([...components, { type: "addRoadmap" }])}
        >
          Add Roadmap
        </Button>
        <Button
          onClick={() =>
            setComponents([...components, { type: "createRoadmap" }])
          }
        >
          Create Roadmap
        </Button>
      </div>
    </div>
  );
};

export default CreateRoadmapForm;
