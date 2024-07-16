import TopicSlider from '../../../../components/TopicSlider'
import { getUserTopics } from '../../../../lib/user'
import React, { ReactNode } from 'react'
import BlogBookSlider from '@/components/BlogBookSlider';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const layout = async ({children}: {children: ReactNode}) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/sign-in");
  }
    const topics = await getUserTopics(userId, undefined);
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