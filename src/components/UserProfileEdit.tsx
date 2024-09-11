"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { handleClientError } from "@/lib/error";
import { profileSchema } from "@/type/user";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Trash } from "lucide-react";
import { FC, useState } from "react";
import { toast } from "./ui/use-toast";
import { useRouter } from "next/navigation";

interface UserProfileEditProps {
  publicMetadata?: CustomJwtSessionClaims["metadata"];
}

export const UserProfileEdit: FC<UserProfileEditProps> = ({
  publicMetadata,
}) => {

  const [socialMedia, setSocialMedia] = useState(
    publicMetadata?.socialMedia || [
      { name: "Website", value: "" },
      { name: "Twitter", value: "" },
      { name: "Github", value: "" },
    ]
  );
  const [newSocialMediaName, setNewSocialMediaName] = useState("");
  const [about, setAbout] = useState(publicMetadata?.about || "");
  const router = useRouter();

  const handleSocialMediaChange = (index: number, value: string) => {
    const updatedSocialMedia = [...socialMedia];
    updatedSocialMedia[index].value = value;
    setSocialMedia(updatedSocialMedia);
  };

  const handleAddSocialMedia = () => {
    if (newSocialMediaName.trim() !== "") {
      setSocialMedia([...socialMedia, { name: newSocialMediaName, value: "" }]);
      setNewSocialMediaName("");
    }
  };
  
  const handleRemoveSocialMedia = (index: number) => {
    const updatedSocialMedia = [...socialMedia];
    updatedSocialMedia.splice(index, 1);
    setSocialMedia(updatedSocialMedia);
  };

  const { mutate: updateProfile } = useMutation({
    mutationFn: async () => {
      const data = {
        about: about,
        socialMedia: socialMedia,
      };
      const payload = profileSchema.parse(data);
      return await axios.post("/api/user/update-profile", payload);
    },
    onMutate: () => {
      toast({
        description: "Updating profile...",
      })
    },
    onError: (error) => {
      handleClientError(error);
    },
    onSuccess: () => {
      router.push("/me");
    }
  });

  return (
    <div className="w-[90%] md:w-full h-full my-[3%] flex justify-center items-center">
      <Card className="w-full max-w-2xl mx-auto">
        <ScrollArea className="h-[600px]">
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>Update your personal information.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="about">About</Label>
              <Textarea
                id="about"
                placeholder="Tell us a bit about yourself..."
                className="min-h-[80px]"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
              />
            </div>
            <Separator />
            <div className="grid gap-4">
              {socialMedia.map((item: any, index: number) => (
                <div key={index} className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor={`social-media-${index}`}>{item.name}</Label>
                    <Input
                      id={`social-media-${index}`}
                      placeholder={`${item.name} username or link`}
                      value={item.value}
                      onChange={(e) =>
                        handleSocialMediaChange(index, e.target.value)
                      }
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveSocialMedia(index)}
                    >
                      <Trash className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="new-social-media-name">
                    New Social Media
                  </Label>
                  <Input
                    id="new-social-media-name"
                    placeholder="Enter social media name"
                    value={newSocialMediaName}
                    onChange={(e) => setNewSocialMediaName(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <Button variant="outline" onClick={handleAddSocialMedia}>
                    Add
                  </Button>
                </div>
              </div>
            </div>
            <Separator />
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="ml-auto"
              onClick={() => updateProfile()}
            >
              Save Changes
            </Button>
          </CardFooter>
        </ScrollArea>
      </Card>
    </div>
  );
};

export default UserProfileEdit;
