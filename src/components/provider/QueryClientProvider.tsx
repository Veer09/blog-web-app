"use client"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { ReactNode } from 'react'


const QueryProvider = ({children} : {children : ReactNode}) => {
    const queryclient = new QueryClient();
  return (
    <QueryClientProvider client={queryclient}>
        {children}
    </QueryClientProvider>
  )
}

export default QueryProvider