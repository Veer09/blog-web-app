import { getUserTopic } from '@/lib/user'
import React, { FC } from 'react'

const DashboardSlider: FC = async () => {
    const topics = await getUserTopic();
    
  return (
    <div>
        
    </div>
  )
}

export default DashboardSlider