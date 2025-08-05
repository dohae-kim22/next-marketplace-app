"use server";

import z from "zod";
import { getSession } from "@/lib/session";
import db from "@/lib/db";
import { redirect } from "next/navigation";

const productSchema = z.object({
  photos: z.array(z.string()).min(1, "At least one photo is required."),
  title: z
    .string("Title is required.")
    .min(2, "Title must be at least 2 characters.")
    .max(100, "Title must be less than 100 characters."),
  description: z
    .string("Description is required.")
    .min(10, "Description must be at least 10 characters.")
    .max(2000, "Description must be less than 2000 characters."),
  price: z.coerce
    .number("Price is required.")
    .min(0, "Price must be at least 0.")
    .max(1_000_000, "Price must be less than 1,000,000."),
  location: z.string("Location is required."),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  countryCode: z.string().optional(),
  latitude: z.coerce.number("Latitude is required."),
  longitude: z.coerce.number("Longitude is required."),
  type: z.enum(["SALE", "FREE", "WANTED"]),
  categoryMain: z.string().min(1, "Main category is required."),
  categorySub: z.string().optional(),
  categorySubSub: z.string().optional(),
});

export async function uploadProduct(_: any, formData: FormData) {
  const data = {
    photos: formData.getAll("photos"),
    title: formData.get("title"),
    price: formData.get("price"),
    description: formData.get("description"),
    location: formData.get("location"),
    latitude: formData.get("latitude"),
    longitude: formData.get("longitude"),
    street: formData.get("street"),
    city: formData.get("city"),
    state: formData.get("state"),
    postalCode: formData.get("postalCode"),
    countryCode: formData.get("countryCode"),
    type: formData.get("type"),
    categoryMain: formData.get("categoryMain"),
    categorySub: formData.get("categorySub"),
    categorySubSub: formData.get("categorySubSub"),
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
      const urls = result.data.photos;
      const product = await db.product.create({
        data: {
          title: result.data.title,
          description: result.data.description,
          price: result.data.price,
          photo: urls[0],
          photos: {
            createMany: {
              data: urls.map((url: string) => ({ url })),
            },
          },
          location: result.data.location,
          latitude: result.data.latitude,
          longitude: result.data.longitude,
          street: result.data.street,
          city: result.data.city,
          state: result.data.state,
          postalCode: result.data.postalCode,
          countryCode: result.data.countryCode,
          type: result.data.type,
          categoryMain: result.data.categoryMain,
          categorySub: result.data.categorySub || null,
          categorySubSub: result.data.categorySubSub || null,
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
      redirect(`/products/${product.id}`);
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
