import BlogCard from '@/components/general/blog/BlogCard';
import { getSavedBlog } from '@/lib/user'
import React, { FC } from 'react'

const page: FC = async () => {
    const savedBlog = await getSavedBlog();
    if(!savedBlog) return ; 
  return (
    <div>
        {savedBlog.map((blog) => {
            return <BlogCard blog={blog} />
        })}
    </div>
  )
}

export default page