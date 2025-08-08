"use server";

import z from "zod";
import { getSession } from "@/lib/session";
import db from "@/lib/db";
import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";

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
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  countryCode: z.string().optional(),
});

export async function uploadPost(_: any, formData: FormData) {
  const data = {
    photo: formData.get("photo"),
    title: formData.get("title"),
    description: formData.get("description"),
    location: formData.get("location"),
    latitude: formData.get("latitude"),
    longitude: formData.get("longitude"),
    street: formData.get("street") as string | undefined,
    city: formData.get("city") as string | undefined,
    state: formData.get("state") as string | undefined,
    postalCode: formData.get("postalCode") as string | undefined,
    countryCode: formData.get("countryCode") as string | undefined,
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
    const locale = await getLocale();

    if (session.id) {
      const post = await db.post.create({
        data: {
          title: result.data.title,
          description: result.data.description,
          photo: result.data.photo,
          location: result.data.location,
          latitude: result.data.latitude,
          longitude: result.data.longitude,
          street: result.data.street,
          city: result.data.city,
          state: result.data.state,
          postalCode: result.data.postalCode,
          countryCode: result.data.countryCode,
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
      redirect({
        href: `/posts/${post.id}`,
        locale,
      });
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
