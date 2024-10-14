import { supabase } from "@/lib/supabase";
import editorjsCodecup from '@calumk/editorjs-codecup';
import Checklist from "@editorjs/checklist";
import Delimiter from "@editorjs/delimiter";
import Embed from "@editorjs/embed";
import Header from "@editorjs/header";
import InlineCode from "@editorjs/inline-code";
import LinkTool from "@editorjs/link";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import SimpleImage from "@editorjs/simple-image";
import Table from "@editorjs/table";
import { v4 as uuidv4 } from "uuid";
import { CustomImage } from "./CustomImage.js";


export const EDITOR_TOOLS = {
  embed: {
    class: Embed,
    inlineToolbar: true,
  },
  delimiter: Delimiter,
  inlineCode: InlineCode,
  linkTool: LinkTool,
  list: List,
  code: {
    class: editorjsCodecup,
    
  },
  header: Header,
  quote: Quote,
  simpleImage: {
    class: SimpleImage,
    inlineToolbar: true,
  },
  table: {
    class: Table,
    inlineToolbar: true,
    config: {
      rows: 2,
      cols: 3,
    },
  },
  checklist: {
    class: Checklist,
    inlineToolbar: true,
  },
  image: {
    class: CustomImage,
    config: {
      uploader: {
        async uploadByFile(file) {
          try {
            const fileType = file ? file.type.split("/") : undefined;
            if (fileType) {
              const { data, error } = await supabase.storage
                .from("Blog-Images")
                .upload(`${uuidv4()}.${fileType[1]}`, file);
              if (error) {
                console.error(error);
                return {
                  success: 0,
                  file: { url: "" },
                };
              }
              return {
                success: 1,
                file: {
                  url: `${process.env.NEXT_PUBLIC_SUPABASE_OBJ_URI}/${data.fullPath}`,
                },
              };
            }
            return {
              success: 0,
              file: { url: "" },
            };
          } catch (err) {
            console.error(err);
            return {
              success: 0,
              file: { url: "" },
            };
          }
        },
      },
    },
  },
};
