import { SignIn } from "@clerk/nextjs";
import React from "react";

const page = () => {
  return (
    <section className=" flex my-12 justify-center items-center">
      <SignIn />
    </section>
  );
};

export default page;
