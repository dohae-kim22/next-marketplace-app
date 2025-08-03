"use server";

import db from "@/lib/db";
import {getSession} from "@/lib/session";
import { redirect } from "next/navigation";
import { z } from "zod";

const liveSchema = z.object({
  title: z
    .string("Title is required.")
    .min(2, "Title must be at least 2 characters.")
    .max(50, "Title must be less than 50 characters."),
  description: z
    .string()
    .max(2000, "Description must be less than 2000 characters.")
    .optional(),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function startLive(_: any, formData: FormData) {
  const data = {
    title: formData.get("title"),
    description: formData.get("description"),
  };

  const result = liveSchema.safeParse(data);
  if (!result.success) {
    const flatten = z.flattenError(result.error);
    return {
      fieldErrors: flatten.fieldErrors,
      values: data,
    };
  }
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream/live_inputs`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
      },
      body: JSON.stringify({
        meta: {
          name: result.data.title,
        },
        recording: {
          mode: "automatic",
        },
      }),
    }
  );

  const responseData = await response.json();
  
  const session = await getSession();
  const stream = await db.liveStream.create({
    data: {
      title: result.data.title,
      description: result.data.description,
      streamId: responseData.result.uid,
      streamKey: responseData.result.rtmps.streamKey,
      rtmpsURL: responseData.result.rtmps.url,
      userId: session.id!,
    },
    select: {
      id: true,
    },
  });
  redirect(`/live/${stream.id}`);
}
