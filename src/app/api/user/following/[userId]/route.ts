import { ApiError, ErrorTypes, handleApiError } from "@/lib/error";
import { getUserFollowings } from "@/lib/user";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { userId: string } }
) => {
  const { searchParams } = new URL(req.url);
  try {
    const index = searchParams.get("page");
    if (!index)
        throw new ApiError("Invalid Params", ErrorTypes.Enum.bad_request);
    const data = await getUserFollowings(params.userId, parseInt(index));
    return NextResponse.json({ users: data }, { status: 200 });
  } catch (err) {
        const { message, code } = handleApiError(err);
    return NextResponse.json({ error: message }, { status: code });;
  }
};
