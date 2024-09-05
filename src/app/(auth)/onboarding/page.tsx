import UserProfileEdit from "@/components/UserProfileEdit";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Page = async () => {
  if(auth().sessionClaims?.metadata.onboardingComplete === true){
    redirect('/dashboard/following');
  }
  return (
    <div className="w-full h-full flex justify-center items-center">
      <UserProfileEdit />;
    </div>
  )
};

export default Page;
