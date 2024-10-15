import { toast } from "@/components/ui/use-toast";
import ImageTool from "@editorjs/image";
import { supabase } from "./supabase";

export class CustomImage extends ImageTool {
  constructor({ data, config, api, readOnly }) {
    super({ data, config, api, readOnly });
    this.api = api;
    this.data = data;
  }

  rendered(){
    console.log(this.api, this.data, this.config, this.readOnly);
  }

  async removed() {
    console.log("removed"); 
    const url = this.data.file?.url;
    const parts = url.split("/");
    const fileName = parts[parts.length - 1];
    const { data, error } = await supabase.storage.from("Blog-Images").remove([fileName]);
    if (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong!!",
        description:
          "There was an error deleting the image. Please try again later.",
      });
    }
  }
}

