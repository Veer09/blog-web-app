"use client";
import React, { FC } from 'react'
import { Button } from '../ui/button'
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from '../ui/use-toast';
import { handleClientError } from '@/lib/error';
import { useRouter } from 'next/navigation';

interface BlogDeleteBtnProps {
    id: string;
}

const BlogDeleteBtn: FC<BlogDeleteBtnProps> = ({ id }) => {
    const router = useRouter();
    const { mutate: deleteBlog } = useMutation({
        mutationFn: async () => {
            return await axios.delete(`/api/blog/${id}`);
        },
        onMutate: () => {
            toast({
                description: "Deleting blog...",
            })
        },
        onError: (error) => {
            handleClientError(error);
        },
        onSuccess: () => {
            router.push('/me/blogs');
        },
        
    })
    return (
        <Button variant={'destructive'} onClick={() => deleteBlog()}>
            Delete
        </Button>
    )
}

export default BlogDeleteBtn