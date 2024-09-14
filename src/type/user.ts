import { EmailAddress } from "@clerk/nextjs/server";
import { z } from "zod";

export const savedBySchema = z.string();

export const UserFollowSchema = z.string();

export type cachedUser = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
  blogs: number;
  followers: number;
}

export const UserFollowAddSchema = z.object({
  userId: z.string(),
  followerId: z.string()
})

export const profileSchema = z.object({
  about: z.string().min(5),
  socialMedia: z.array(z.object({
    name: z.string(),
    value: z.string().min(5, { message: "Social media link must be atleast 5 characters long" })
  }))
});

export type ClerkUserTransfer = {
  id: string,
  imageUrl: string,
  publicMetadata: UserPublicMetadata,
  emailAddresses: string[],
  fullName: string | null
}