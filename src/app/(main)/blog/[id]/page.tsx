import BlogPage from '@/components/blog-view/BlogPage'

const page = ({ params }: {params: {id: string}}) => {
  return (
    <BlogPage id={params.id}/>
  )
}

export default page