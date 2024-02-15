import { Topic } from '@prisma/client'
import Link from 'next/link'
import React, { FC } from 'react'

interface TopicListProps{
    topics: Topic[]
}
const TopicList: FC<TopicListProps> = ({ topics }) => {
    return(
        <div className=' flex my-5 mx-16 m-auto w-full gap-4'>
            {
                topics.map((topic, key) => {
                    return <Link href={`/topic/${topic.name}`} key={key} className=' text-white text-sm font-normal text-center bg-primary py-2 px-4 cursor-pointer rounded-[100px]'>{topic.name} </Link>
                })
            }
        </div>
    )
}

export default TopicList