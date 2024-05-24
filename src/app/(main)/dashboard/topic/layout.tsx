import TopicSlider from '../../../../components/TopicSlider'
import { getUserTopics } from '../../../..//lib/user'
import React, { ReactNode } from 'react'

const layout = async ({children}: {children: ReactNode}) => {
    const topics = await getUserTopics(undefined);
    
  return (
    <div>
        <TopicSlider topics={topics}/>
        {children}
    </div>
  )
}

export default layout