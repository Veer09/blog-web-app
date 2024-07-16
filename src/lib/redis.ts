import { Redis } from "@upstash/redis";

if(!process.env.NEXT_PUBLIC_UPSTASH_URL || !process.env.NEXT_PUBLIC_UPSTASH_TOKEN) {
  throw new Error("Upstash URL and Token not found");
}

export const redis = new Redis({
  url: process.env.NEXT_PUBLIC_UPSTASH_URL as string,
  token: process.env.NEXT_PUBLIC_UPSTASH_TOKEN as string,
});
