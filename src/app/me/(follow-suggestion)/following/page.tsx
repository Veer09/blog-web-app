import FollowContainer from '@/components/FollowContainer';
import TopicFollow from '@/components/TopicFollow';
import { getUserTopicCount } from '@/lib/user'
import React, { FC } from 'react'

const page : FC = async () => {
    const topics = await getUserTopicCount();
    if(!topics) return
  return (
    <div>
        <FollowContainer topics={topics}/>
    </div>
  )
}

export default page