import React from 'react'
import { getBooksByTopic } from '@/lib/topic'

const page = async ({ params }: {params: {name: string}}) => {
    const books = await getBooksByTopic(params.name);
  return (
    <div>
        {
            books.map((book, key) => {
                return (
                    <div key={key}>
                        <h1>{book.title}</h1>
                        <p>{book.description}</p>
                    </div>
                )
            })
        }
    </div>
  )
}

export default page