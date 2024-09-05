"use client";
import React, { FC } from 'react'
import { Button } from '../ui/button'
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

interface BlogDeleteBtnProps {
    id: string;
}

const BlogDeleteBtn: FC<BlogDeleteBtnProps> = ({ id }) => {
    const { mutate: deleteBlog } = useMutation({
        mutationFn: async () => {
            return await axios.delete(`/api/blog/${id}`);
        }
    })
    return (
        <Button variant={'destructive'} onClick={() => deleteBlog()}>
            Delete
        </Button>
    )
}

export default BlogDeleteBtn