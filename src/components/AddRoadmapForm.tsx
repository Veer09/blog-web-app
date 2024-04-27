import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import CreateRoadmapForm from "./CreateRoadmapForm";


const AddRoadmapForm = () => {
  return (
    <div className=" flex flex-col gap-3 border-l-4 pl-4">
      <Input placeholder="Select Roadmap" />
    </div>
  );
};

export default AddRoadmapForm;
