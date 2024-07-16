import { ApiError, ErrorTypes, handleApiError } from "@/lib/error";
import { getUserTopics } from "@/lib/user";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { userId: string } }
) => {
  const { searchParams } = new URL(req.url);
  const index = searchParams.get("page");
  try {
    if (!index)
      throw new ApiError("Invalid Params", ErrorTypes.Enum.bad_request);
    const data = await getUserTopics(params.userId, parseInt(index));
    return NextResponse.json({ topics: data });
  } catch (err) {
    handleApiError(err);
  }
};
