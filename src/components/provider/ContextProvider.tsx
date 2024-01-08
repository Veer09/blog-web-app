'use client'
import { TopicWithCount } from "@/lib/topic";
import React, { Dispatch, FC, ReactNode, SetStateAction, useState } from "react";
import { createContext } from "react";

interface contextType {
    state: TopicWithCount & { isFollowed: boolean},
    setState: Dispatch<SetStateAction<TopicWithCount & { isFollowed: boolean}>>
}

export const FollowContext = createContext<contextType | null>(null);

interface ContextProviderProps {
  children: ReactNode;
  followObj: TopicWithCount & { isFollowed: boolean};
}

const ContextProvider: FC<ContextProviderProps> = ({ children, followObj }) => {
  const [followState, setFollowState] = useState(followObj);
  const follow = {
    state: followState,
    setState: setFollowState
  }
  return (
    <FollowContext.Provider value={follow}>
        {children}
    </FollowContext.Provider>
  );
};

export default ContextProvider;
