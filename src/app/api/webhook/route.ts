import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";
import prisma from "@/lib/db";
import { redis } from "@/lib/redis";
const webhookSecret = process.env.WEBHOOK_SECRET || ``;


async function validateRequest(request: Request) {
  const payloadString = await request.text();
  const headerPayload = headers();

  const svixHeaders = {
    "svix-id": headerPayload.get("svix-id")!,
    "svix-timestamp": headerPayload.get("svix-timestamp")!,
    "svix-signature": headerPayload.get("svix-signature")!,
  };
  const wh = new Webhook(webhookSecret);
  return wh.verify(payloadString, svixHeaders) as WebhookEvent;
}

export async function POST(request: Request) {
  const payload = await validateRequest(request);
  if (payload.type === "user.created" || payload.type === "user.updated") {
    await prisma.user.upsert({
      where: {
        id: payload.data.id,
      },
      update: {
        id: payload.data.id,
      },
      create: {
        id: payload.data.id as string,
      },
    });
  }
  if(payload.type === 'user.created'){
    await redis.hset(`user:${payload.data.id}`, { 
      id: payload.data.id,
      name: payload.data.username,
      imageUrl: payload.data.image_url,
      blogs: 0,
      followers: 0,
    });
    await redis.sadd(`users`, payload.data.id);
  }
  if(payload.type === 'user.deleted'){
    await prisma.user.delete({
        where: {
            id: payload.data.id as string,
        }
    })
  }
  return Response.json({ message: "User Created Sucessfully!!" });
}
