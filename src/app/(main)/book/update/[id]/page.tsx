import UpdateBook from '@/components/UpdateBook';
import { redis } from '@/lib/redis'
import { Chapter } from '@/type/book';
import { notFound } from 'next/navigation';
import React from 'react'

const page = async ({ params } : {params: {id: string}}) => {
    const chapters: Chapter[] | null = await redis.json.get(`book:${params.id}`);
    if(!chapters) return notFound();
  return (
  <UpdateBook chapters={chapters} id={params.id}/>
  )
}

export default page