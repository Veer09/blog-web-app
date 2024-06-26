"use client"
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { FC } from 'react'
import { ZodError } from 'zod'
import { Button } from '../ui/button'
import { toast } from '../ui/use-toast'

interface BookFollowButtonProps {
    isFollowed: boolean
    bookId: string
}

const BookFollowButton:FC<BookFollowButtonProps> = ({ isFollowed, bookId }) => {
    const { mutate: follow, isPending: followPending } = useMutation({
        mutationKey: ["follow"],
        mutationFn: () => {
          return axios.post(`/api/topic/${bookId}/follows`);
        },
        onError: (err) => {
          if (err instanceof ZodError || err instanceof AxiosError) {
            toast({
              title: "Incorrect Data",
              description: err.message,
              variant: "destructive",
            });
          }
        },
      });
    
      const { mutate: unfollow, isPending: unfollowPending } = useMutation({
        mutationKey: ["unfollow"],
        mutationFn: () => {
          return axios.post(`/api/topic/${bookId}/unfollows`);
        },
        onError: (err) => {
          if (err instanceof ZodError || err instanceof AxiosError) {
            toast({
              title: "Incorrect Data",
              description: err.message,
              variant: "destructive",
            });
          }
        },
      });


  return (
    <Button
      variant={isFollowed ? "outline" : "default"}
      onClick={(isFollowed) ? () => unfollow() : () => follow() }
      disabled={(followPending || unfollowPending) ? true : false}
    >
      {isFollowed ? "Following" : "Follow"}
    </Button>
  )
}

export default BookFollowButton