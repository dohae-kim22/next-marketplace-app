"use server";

import z from "zod";
import getSession from "@/lib/session";
import db from "@/lib/db";
import { redirect } from "next/navigation";

const productSchema = z.object({
  photo: z.string().optional(),
  title: z
    .string("Title is required.")
    .min(2, "Title must be at least 2 characters.")
    .max(50, "Title must be less than 50 characters."),
  description: z
    .string()
    .min(2, "Description must be at least 2 characters.")
    .max(2000, "Description must be less than 2000 characters."),
  location: z.string("Location is required."),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function uploadProduct(_: any, formData: FormData) {
  const data = {
    photo: formData.get("photo"),
    title: formData.get("title"),
    description: formData.get("description"),
    location: formData.get("location"),
    latitude: formData.get("latitude"),
    longitude: formData.get("longitude"),
  };

  const result = productSchema.safeParse(data);

  if (!result.success) {
    const flatten = z.flattenError(result.error);
    return {
      fieldErrors: flatten.fieldErrors,
      values: data,
    };
  } else {
    const session = await getSession();
    if (session.id) {
      const post = await db.post.create({
        data: {
          title: result.data.title,
          description: result.data.description,
          photo: result.data.photo,
          location: result.data.location,
          latitude: result.data.latitude,
          longitude: result.data.longitude,
          user: {
            connect: {
              id: session.id,
            },
          },
        },
        select: {
          id: true,
        },
      });
      redirect(`/posts/${post.id}`);
    }
  }
}

export async function getUploadURL() {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
      },
    }
  );

  const data = await response.json();
  return data;
}
