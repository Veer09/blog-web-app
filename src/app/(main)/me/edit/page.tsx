import UserProfileEdit from "@/components/UserProfileEdit";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Page = async () => {
  const { userId, sessionClaims } = auth();
  if (!userId) redirect("/sign-in");
  return <UserProfileEdit publicMetadata={sessionClaims.metadata} />;
};

export default Page;
