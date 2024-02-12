// import { UserFollowSchema } from "@/type/user";
// import { auth } from "@clerk/nextjs";
// import { NextRequest, NextResponse } from "next/server";

// export const POST = async (req: NextRequest) => {
//   try {
//     const { payload } = await req.json();
//     const followerId = UserFollowSchema.safeParse(payload);
//     const { userId } = auth();
//     if (!userId)
//       return NextResponse.json({ error: "User Unauthorized" }, { status: 401 });

//   } catch (err) {
//     return NextResponse.json({ error: err.message }, { status: 400 });
//   }
// };
