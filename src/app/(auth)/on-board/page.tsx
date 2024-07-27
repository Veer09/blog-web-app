import UserProfileEdit from "@/components/UserProfileEdit";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = () => {
  const user = useUser();
  if (!user.isLoaded) return null;
  if (!user.isSignedIn) redirect("/sign-in");
  if (user.user.publicMetadata.about) redirect("/dashborad");
  return <UserProfileEdit />;
};

export default Page;
