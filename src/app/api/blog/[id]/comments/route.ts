import { getBlogCommets } from "@/lib/blog";
import { ApiError, ErrorCodes, ErrorTypes, handleApiError } from "@/lib/error";
import { redis } from "@/lib/redis";
import { setUser } from "@/lib/user";
import { cachedUser } from "@/type/user";
import { unstable_cache } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const showComments = unstable_cache(
      async () => getComments(params.id),
      ["comments", params.id],
      {
        tags: [`comments:${params.id}`],
      }
    );

    const fullComment = await showComments();
    return NextResponse.json({ comments: fullComment });
  } catch (err) {
    handleApiError(err);
  }
};

const getComments = async (blogId: string) => {
  const comments = await getBlogCommets(blogId);

  const fullComment = Array.from(
    await Promise.all(
      comments.map(async (comment) => {
        let user: cachedUser | null = await redis.hgetall(
          `user:${comment.user_id}`
        );
        if (!user) {
          user = await setUser(comment.user_id);
          if(!user) throw new ApiError("Something wrong with  db, Please contact!!", ErrorTypes.Enum.internal_server_error);
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
};
