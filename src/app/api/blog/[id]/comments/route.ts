import { getBlogCommets } from "@/lib/blog";
import { redis } from "@/lib/redis";
import { setUser } from "@/lib/user";
import { cachedUser } from "@/type/user";
import { unstable_cache } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { comment } from "postcss";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
    const showComments = unstable_cache(
        async () => getComments(params.id),
        ["comments", params.id],
        {
          tags: [`comments:${params.id}`],
        }
    )

    const fullComment = await showComments();
    return NextResponse.json({ comments: fullComment });
};

const getComments = async (blogId: string) => {
    const comments = await getBlogCommets(blogId);
    if (!comments) return NextResponse.json({message: "Invalid Request"}, {status: 400});
    const fullComment = Array.from(
      await Promise.all(
        comments.map(async (comment) => {
          let user: cachedUser | null = await redis.hgetall(
            `user:${comment.user_id}`
          );
          if (!user){
            user = await setUser(comment.user_id);
            if(!user) return NextResponse.json({message: "Invalid Request"}, {status: 400}) ;
          }
          return {
            ...comment,
            user: {
              firstName: user.firstName,
              lastName: user.lastName,
              imageUrl: user.imageUrl,
            },
          };
        })
      )
    );
    return fullComment;
}