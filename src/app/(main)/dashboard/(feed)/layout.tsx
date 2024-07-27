import TopicSlider from '../../../../components/TopicSlider'
import { getUserTopics } from '../../../../lib/user'
import React, { ReactNode } from 'react'
import BlogBookSlider from '@/components/BlogBookSlider';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const layout = async ({children}: {children: ReactNode}) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/sign-in");
  }
  const topics = await getUserTopics(userId, 1);
  return (
    <>
      <div className='flex'>
        <TopicSlider topics={topics}/>
        <BlogBookSlider />
      </div>
        {children}
    </>
  )
}

export default layout