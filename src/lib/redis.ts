import { Redis } from "@upstash/redis";

if(!process.env.UPSTASH_URL || !process.env.UPSTASH_TOKEN) {

  throw new Error("Upstash URL and Token not found");
}

export const redis = new Redis({
  url: process.env.UPSTASH_URL as string,
  token: process.env.UPSTASH_TOKEN as string,
});
