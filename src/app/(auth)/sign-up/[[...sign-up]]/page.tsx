import { SignUp } from "@clerk/nextjs";
import React from "react";

const page = () => {
  return (
    <section className=" flex h-screen justify-center items-center">
      <SignUp />
    </section>
  );
};

export default page;
