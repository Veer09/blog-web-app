import BlogCard from '@/components/BlogCard';
import { getSavedBlog } from '@/lib/user'
import React, { FC } from 'react'

const page: FC = async () => {
    const savedBlog = await getSavedBlog();
    if(!savedBlog) return ; 
  return (
    <div>
        {savedBlog.map((blog, key) => {
            return <BlogCard blog={blog} key={key}/>
        })}
    </div>
  )
}

export default page