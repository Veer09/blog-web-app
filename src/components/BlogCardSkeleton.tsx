import React from 'react'
import { Skeleton } from './ui/skeleton'

const BlogCardSkeleton = () => {
  return (
    <div className=" flex justify-between">
    <div className=" flex flex-col gap-3">
      <Skeleton className=" h-[30px] w-[200px]" />
      <Skeleton className=" h-[15px] w-[500px]" />
      <Skeleton className=" h-[15px] w-[500px]" />
    </div>
    <div>
      <Skeleton className=" h-24 w-24" />
    </div>
  </div>
  )
}

export default BlogCardSkeleton