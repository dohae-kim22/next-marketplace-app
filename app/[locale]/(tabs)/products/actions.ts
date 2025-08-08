"use server";

import db from "@/lib/db";
import { getUserWithLocation } from "@/lib/session";
import { getDistanceFromLatLonInKm } from "@/lib/utils";

const PAGE_SIZE = 20;

export async function getMoreProducts(page: number) {
  const skip = page * PAGE_SIZE;

  const rows = await db.product.findMany({
    select: {
      title: true,
      price: true,
      id: true,
      photo: true,
      created_at: true,
      views: true,
      productLikes: true,
      location: true,
      status: true,
      type: true,
      latitude: true,
      longitude: true,
      city: true,
      street: true,
      postalCode: true,
      state: true,
      countryCode: true,
    },
    orderBy: { created_at: "desc" },
    skip,
    take: PAGE_SIZE,
  });

  const user = await getUserWithLocation();
  let filtered = rows;
  if (user?.latitude && user.longitude && user.radius) {
    filtered = rows.filter((p) => {
      if (p.latitude === null || p.longitude === null) return false;
      const d = getDistanceFromLatLonInKm(
        user.latitude!,
        user.longitude!,
        p.latitude,
        p.longitude
      );
      return d <= user.radius!;
    });
  }

  return filtered;
}

export async function getMoreSearchedProducts(page: number, query: string) {
  const skip = page * PAGE_SIZE;

  if (!query?.trim()) return [];

  const rows = await db.product.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      title: true,
      price: true,
      photo: true,
      created_at: true,
      views: true,
      productLikes: true,
      location: true,
      city: true,
      street: true,
      postalCode: true,
      state: true,
      countryCode: true,
      status: true,
      type: true,
    },
    orderBy: { created_at: "desc" },
    skip,
    take: PAGE_SIZE,
  });

  return rows;
}
