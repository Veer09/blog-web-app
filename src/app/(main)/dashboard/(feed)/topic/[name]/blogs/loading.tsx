import BlogCardSkeleton from "@/components/blog-view/BlogCardSkeleton";

const loading = () => {
  return (
    <div className=" w-[70%] my-5 flex flex-col gap-3">
      {
        Array(5).fill(0).map((_, key) => {
          return <BlogCardSkeleton key={key} />
        })
      }
    </div>
    
  );
};

export default loading;
