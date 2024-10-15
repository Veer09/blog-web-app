import { BlogPage } from '@/components/blog-view/BlogPage'
import { getBlogById } from '@/lib/blog';
import { Metadata } from 'next';
import { unstable_cache } from 'next/cache';
import { notFound } from 'next/navigation';


export const generateMetadata = async ({params}: {params: {id: string}}) : Promise<Metadata> => {
  const { id } = params;
  const getBlog = unstable_cache(
    async () => {
      return await getBlogById(id)
    },
    ["blog", id],
    {
      tags: [`blog:${id}`],
    }
  );

  const blog = await getBlog();
  if (!blog) return notFound();

  return {
    title: blog.title,
    description: blog.description,
    keywords: blog.topics.map((topic) => topic.name).join(", "),
  }
}

const page = ({ params }: {params: {id: string}}) => {
  return (
    <BlogPage id={params.id}/>
  )
}

export default page; 