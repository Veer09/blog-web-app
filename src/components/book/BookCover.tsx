import Image from "next/image"
import Link from "next/link"
import { FC } from "react"

interface BookCoverProps {
  title: string
  description: string
  topic: string | null 
  id: string
  coverImage?: string
  darkText?: boolean
}

export const BookCover: FC<BookCoverProps> = async ({ title, description, id, coverImage, darkText, topic }) => {
  return (
    <Link href={`/book/${id}/0/0`} className={`${(darkText) ? 'text-black' : 'text-white'} rounded-lg shadow-md overflow-hidden w-full max-w-[300px]`} >
      <div className="relative border rounded-lg aspect-square">
        <Image
          alt="Book Cover"
          className="w-[250px] h-[300px] rounded-lg"
          src={coverImage ? coverImage : "/placeholder.png"}
          width={200}
          height={200}
        />
        <div className={`absolute w-full top-3 gap-4 flex flex-col ${darkText ? 'text-black' : 'text-white'} p-4`}>
          <h2 className="font-bold overflow-hidden text-ellipsis whitespace-nowrap text-2xl leading-tight line-clamp-2">
            {title}
          </h2>
          <h2 className="font-bold text-sm break-words leading-tight">
            {description}
          </h2>
          <h2 className="font-bold mt-4 text-sm break-words leading-tight">
            {topic}
          </h2>
        </div>
      </div>
    </Link>
  )
}