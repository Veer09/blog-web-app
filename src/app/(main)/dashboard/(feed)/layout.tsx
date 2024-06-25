import TopicSlider from '../../../../components/TopicSlider'
import { getUserTopics } from '../../../../lib/user'
import React, { ReactNode } from 'react'
import BlogBookSlider from '@/components/BlogBookSlider';

const layout = async ({children}: {children: ReactNode}) => {
    const topics = await getUserTopics(undefined);
  return (
    <div>
      <div className='flex'>
        <TopicSlider topics={topics}/>
        <BlogBookSlider />
      </div>
        {children}
    </div>
  )
}

export default layout