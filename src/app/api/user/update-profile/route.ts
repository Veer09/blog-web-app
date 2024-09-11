import { ApiError, ErrorTypes, handleApiError } from "@/lib/error";
import { profileSchema } from "@/type/user";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    const data = await req.json();
    try{
        const payload = profileSchema.parse(data);
        const { userId } = auth();
        if(!userId) throw new ApiError("Unautherized!!", ErrorTypes.Enum.unauthorized);
        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                onboardingComplete: true,
                ...payload,
            },
        })
        NextResponse.json({ message: "Profile updated successfully" });
    }catch(err){
        const { message, code } = handleApiError(err);
        return NextResponse.json({ error: message }, { status: code });;
    }
}