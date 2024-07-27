"use client";
import { Draft } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { FC } from "react";

interface DraftCardProps {
  draft: Draft;
}

const DraftCard: FC<DraftCardProps> = ({ draft }) => {
  const router = useRouter();
  return (
    <div
      className=" flex gap-4 justify-between cursor-pointer items-center mx-10 h-44 "
      onClick={() => router.push(`/draft/${draft.id}`)}
    >
      <div className=" flex flex-col justify-evenly h-full">
        <div>
          <p className=" text-xl font-bold py-3">{draft.name}</p>
        </div>
        <p className=" text-xs">
          {"Updated At" + " : " + new Date(draft.updatedAt).toDateString()}
        </p>
      </div>
    </div>
  );
};

export default DraftCard;
