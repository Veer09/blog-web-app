"use client"
import React from 'react'
import { Tabs, TabsList, TabsTrigger } from './ui/tabs'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const BlogBookSlider = () => {
    const pathname = usePathname()
    const currentTopic = decodeURI(pathname.split('/')[3])
    const currentSection = pathname.split('/')[4]
  return (
    <Tabs value={currentSection} defaultValue='blogs'>
        <TabsList>
          <TabsTrigger value="blogs">
            <Link href={`/dashboard/topic/${currentTopic}/blogs`}>
              Blogs
            </Link>
          </TabsTrigger>
          <TabsTrigger value="books">
            <Link href={currentTopic ? `/dashboard/topic/${currentTopic}/books` : "/dashboard/topic//books"}>
              Books
            </Link>
          </TabsTrigger> 
        </TabsList>
      </Tabs>

  )
}

export default BlogBookSlider