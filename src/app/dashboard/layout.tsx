import BlogSelection from '@/components/dashboard/BlogSelection'
import React, { FC, ReactNode } from 'react'

const page = ({children} : {children : ReactNode}) => {
  return (
    <div className=' w-full my-6 flex-col flex items-center'>
        <BlogSelection/>
        {children}
    </div>
  )
}

export default page