import { NextRequest, NextResponse } from "next/server";
import { getFeedBlogs } from "@/lib/user";
import { auth } from "@clerk/nextjs/server";
import { ApiError, ErrorTypes, handleApiError } from "@/lib/error";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  try {
    const index = searchParams.get("index");
    if (!index)
      throw new ApiError("Inavalid params!!", ErrorTypes.Enum.bad_request);
    const { userId } = auth();
    if (!userId) {
      throw new ApiError(
        "Unauthorized!! Login first to access",
        ErrorTypes.Enum.unauthorized
      );
    }
    const blogs = await getFeedBlogs(userId, parseInt(index));
    return NextResponse.json(blogs);
  } catch (err) {
        const { message, code } = handleApiError(err);
    return NextResponse.json({ error: message }, { status: code });;
  }
};
