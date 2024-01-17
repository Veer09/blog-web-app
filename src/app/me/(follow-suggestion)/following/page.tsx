import FollowContainer from '@/components/general/topic/FollowContainer';
import TopicFollow from '@/components/general/topic/TopicFollow';
import { getUserTopicCount } from '@/lib/user'
import React, { FC } from 'react'

const page : FC = async () => {
    const topics = await getUserTopicCount();
    if(!topics) return
  return (
    <div>
        <FollowContainer topics={topics}/>
        {/* <FollowContainer ={topics}/> */}
    </div>
  )
}

export default page