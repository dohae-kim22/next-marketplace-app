"use server";

import db from "@/lib/db";
import { getUserWithLocation } from "@/lib/session";
import { getDistanceFromLatLonInKm, PAGE_SIZE } from "@/lib/utils";
import { findCategoryBySlugs } from "@/lib/categoryUtils";

export async function getMoreCategoryProducts(page: number, slug: string[]) {
  const skip = page * PAGE_SIZE;

  const [mainSlug, subSlug, subSubSlug] = slug || [];
  const mainObj = findCategoryBySlugs([mainSlug]);
  const subObj = findCategoryBySlugs([mainSlug, subSlug]);
  const subSubObj = findCategoryBySlugs([mainSlug, subSlug, subSubSlug]);

  const where: any = {};
  if (mainObj?.id) where.categoryMain = mainObj.id;
  if (subObj?.id) where.categorySub = subObj.id;
  if (subSubObj?.id) where.categorySubSub = subSubObj.id;

  const rows = await db.product.findMany({
    where,
    select: {
      id: true,
      title: true,
      price: true,
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
      categoryMain: true,
      categorySub: true,
      categorySubSub: true,
    },
    orderBy: { created_at: "desc" },
    skip,
    take: PAGE_SIZE,
  });

  const user = await getUserWithLocation();
  if (!(user?.latitude && user.longitude && user.radius)) {
    return rows;
  }

  const filtered = rows.filter((p) => {
    if (p.latitude === null || p.longitude === null) return false;
    const d = getDistanceFromLatLonInKm(
      user.latitude!,
      user.longitude!,
      p.latitude,
      p.longitude
    );
    return d <= user.radius!;
  });

  return filtered;
}
