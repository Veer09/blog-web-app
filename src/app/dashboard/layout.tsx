import TopicSlider from '@/components/TopicSlider'
import { getUserTopics } from '@/lib/user';
import React, { FC, ReactNode } from 'react'

const page = async ({children} : {children : ReactNode}) => {
  const topics = await getUserTopics(undefined);
  if (!topics) return;
  return (
    <div className=' w-full my-6 flex-col flex items-center'>
        <TopicSlider topics={topics}/>
        {children}
    </div>
  )
}

export default page