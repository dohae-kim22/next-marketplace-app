"use server";

import { z } from "zod";
import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

const profileSchema = z.object({
  userName: z
    .string()
    .min(2, "Username must be at least 2 characters.")
    .max(10, "Username must be at most 10 characters."),
  avatar: z.url("Invalid avatar URL.").optional().or(z.literal("")),
  location: z.string().min(1, "Location is required."),
  latitude: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)), { message: "Invalid latitude." }),
  longitude: z.string().refine((val) => !isNaN(parseFloat(val)), {
    message: "Invalid longitude.",
  }),
  radius: z.string().refine((val) => [5, 10, 30, 50].includes(Number(val)), {
    message: "Invalid radius.",
  }),
});

export async function updateProfile(formData: FormData) {
  const session = await getSession();
  if (!session?.id) throw new Error("Unauthorized");

  const rawData = {
    userName: formData.get("userName"),
    avatar: formData.get("avatar"),
    location: formData.get("location"),
    latitude: formData.get("latitude"),
    longitude: formData.get("longitude"),
    radius: formData.get("radius"),
  };

  const result = profileSchema.safeParse(rawData);

  if (!result.success) {
    return {
      fieldErrors: result.error.flatten().fieldErrors,
      values: rawData,
    };
  }

  const { userName, avatar, location, latitude, longitude, radius } =
    result.data;

  await db.user.update({
    where: { id: session.id },
    data: {
      userName,
      avatar: avatar || null,
      location,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      radius: Number(radius),
    },
  });

  redirect("/profile");
}

// Get Cloudflare Upload URL
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

  if (!response.ok) {
    throw new Error("Failed to get upload URL from Cloudflare");
  }

  return response.json();
}
