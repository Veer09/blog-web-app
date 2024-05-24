import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const loading = () => {
  return (
    <div className=" flex flex-col items-center my-20 w-[80vw]">
      <div className=" w-[60%]">
        <div className=" flex flex-col gap-3">
          <Skeleton className=" w-1/3 h-9" />
          <Skeleton className=" w-1/2 h-3" />
          <Skeleton className=" w-1/2 h-3" />
          <Skeleton className=" w-1/2 h-3" />
        </div>
        <div className="border-y-2 w-full justify-between flex py-3 my-8 px-3 gap-8 items-center">
          <div className="w-full flex gap-8 justify-center items-center">
            <Skeleton className=" w-12 h-12 rounded-[50%]" />
            <div className="w-full flex flex-col gap-2">
              <Skeleton className=" w-1/4 h-6" />
              <Skeleton className=" w-1/3 h-3" />
            </div>
          </div>
          <div>
            <div className="flex gap-2">
              <Skeleton className=" w-6 h-6 rounded-[50%]" />
              <Skeleton className=" w-6 h-6 rounded-[50%]" />
              <Skeleton className=" w-6 h-6 rounded-[50%]" />
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col gap-2">
          <Skeleton className=" w-full h-3" />
          <Skeleton className=" w-full h-3" />
          <Skeleton className=" w-full h-3" />
          <Skeleton className=" w-full h-3" />
          <Skeleton className=" w-full h-3" />
        </div>
      </div>
    </div>
  );
};

export default loading;
