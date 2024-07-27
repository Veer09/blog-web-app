import { ScrollArea } from "@/components/ui/scroll-area";
import UserProfileEdit from "@/components/UserProfileEdit";
import { useUser } from "@clerk/nextjs";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Page = async () => {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  const user = await clerkClient.users.getUser(userId);
  return <UserProfileEdit publicMetadata={user.publicMetadata} />;
};

export default Page;
