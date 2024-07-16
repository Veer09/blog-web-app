
import { supabase } from "@/lib/supabase"
import Image from "next/image"
import Link from "next/link"
import { FC } from "react"

interface BookCoverProps {
    title: string
    description: string
    id: string
}

export const BookCover: FC<BookCoverProps> = async ({ title, description, id}) => {
  const imageURI = supabase.storage.from("Blog-Images").getPublicUrl(id);
    return (
      <Link href={`book/${id}/0/0`} className="bg-white rounded-lg shadow-md overflow-hidden w-full max-w-[300px]" >
        <div className="relative aspect-square cursor-pointer">
          <Image
            alt="Book Cover"
            className="object-cover rounded-lg w-full h-full"
            src={imageURI.data.publicUrl}
            width={300}
            height={400}
            style={{
              aspectRatio: "300/300",
              objectFit: "cover",
            }}
          />
          <div className="absolute top-3 flex items-end p-4">
            <h2 className=" text-white font-bold text-xl leading-tight line-clamp-2">
              {title}
            </h2>
          </div>
          <div className="absolute top-10 flex items-end p-4">
            <h6 className="text-slate-200 text-xs leading-tight line-clamp-2">
              {description}
            </h6>
          </div>
        </div>
      </Link>
    )
  }