"use client"
import ServerError from "@/components/ServerError";
import React from "react";

const error = () => {
  return (
    <div className="w-[200px] h-[200px] flex justify-center items-center">
      <h1>Something went wrong!! Please try again later!</h1>
    </div>
  );
};

export default error;
