"use server";

import z from "zod";
import {getSession} from "@/lib/session";
import db from "@/lib/db";
import { redirect } from "next/navigation";

const productSchema = z.object({
  photos: z.array(z.string()).min(1, "At least one photo is required."),
  title: z
    .string()
    .min(2, "Title must be at least 2 characters.")
    .max(100, "Title must be less than 100 characters."),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters.")
    .max(2000, "Description must be less than 2000 characters."),
  price: z.coerce
    .number()
    .min(0, "Price must be at least 0.")
    .max(1_000_000, "Price must be less than 1,000,000."),
  location: z.string(),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
});

export async function updateProduct(productId: number, formData: FormData) {
  const data = {
    photos: formData.getAll("photos"),
    title: formData.get("title"),
    price: formData.get("price"),
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
  }

  const session = await getSession();
  if (!session.id) {
    throw new Error("Unauthorized");
  }

  const urls = result.data.photos;
  await db.product.update({
    where: { id: productId },
    data: {
      title: result.data.title,
      description: result.data.description,
      price: result.data.price,
      photo: urls[0],
      photos: {
        deleteMany: {},
        createMany: {
          data: urls.map((url) => ({ url })),
        },
      },
      location: result.data.location,
      latitude: result.data.latitude,
      longitude: result.data.longitude,
    },
  });

  redirect(`/products/${productId}`);
}
