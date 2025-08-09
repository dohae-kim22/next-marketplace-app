"use server";

import db from "@/lib/db";
import { getUserWithLocation } from "@/lib/session";
import { PAGE_SIZE } from "@/lib/utils";
import { findCategoryBySlugs } from "@/lib/categoryUtils";
import { rawNearbyProducts } from "@/lib/sql/productRaw";
import type { ListProductProps, RawRow } from "@/lib/types/product";
import { bboxFrom, normalizeProductRow } from "@/lib/products";

function categoryIdsFromSlugs(slug: string[]) {
  const [mainSlug, subSlug, subSubSlug] = slug || [];
  const mainObj = findCategoryBySlugs([mainSlug]);
  const subObj = findCategoryBySlugs([mainSlug, subSlug]);
  const subSubObj = findCategoryBySlugs([mainSlug, subSlug, subSubSlug]);
  return {
    mainId: mainObj?.id ?? null,
    subId: subObj?.id ?? null,
    subSubId: subSubObj?.id ?? null,
  };
}

export async function getMoreCategoryProducts(
  page: number,
  slug: string[]
): Promise<ListProductProps[]> {
  const skip = page * PAGE_SIZE;
  const user = await getUserWithLocation();
  const cats = categoryIdsFromSlugs(slug);

  if (!user?.latitude || !user.longitude || !user.radius) {
    const rows = await db.product.findMany({
      where: {
        ...(cats.mainId ? { categoryMain: cats.mainId } : {}),
        ...(cats.subId ? { categorySub: cats.subId } : {}),
        ...(cats.subSubId ? { categorySubSub: cats.subSubId } : {}),
      },
      select: {
        id: true,
        title: true,
        price: true,
        photo: true,
        created_at: true,
        views: true,
        location: true,
        status: true,
        type: true,
        latitude: true,
        longitude: true,
        street: true,
        city: true,
        state: true,
        postalCode: true,
        countryCode: true,
        categoryMain: true,
        categorySub: true,
        categorySubSub: true,
        productLikes: { select: { id: true, userId: true, productId: true } },
      },
      orderBy: [{ created_at: "desc" }, { id: "desc" }],
      skip,
      take: PAGE_SIZE,
    });
    return rows.map((r) =>
      normalizeProductRow({ ...r, productLikes: r.productLikes } as RawRow)
    );
  }

  const { latitude: lat, longitude: lon, radius: radiusKm } = user;
  const bbox = bboxFrom(lat!, lon!, radiusKm!);
  const rows = await rawNearbyProducts({
    lat: lat!,
    lon: lon!,
    radiusKm: radiusKm!,
    bbox,
    skip,
    limit: PAGE_SIZE,
    includeDistance: false,
    categoryIds: cats,
  });

  return rows.map(normalizeProductRow);
}

export async function getFirstCategoryPage(
  slug: string[]
): Promise<{ items: ListProductProps[]; user: any }> {
  const user = await getUserWithLocation();
  const cats = categoryIdsFromSlugs(slug);

  if (!user?.latitude || !user.longitude || !user.radius) {
    const rows = await db.product.findMany({
      where: {
        ...(cats.mainId ? { categoryMain: cats.mainId } : {}),
        ...(cats.subId ? { categorySub: cats.subId } : {}),
        ...(cats.subSubId ? { categorySubSub: cats.subSubId } : {}),
      },
      select: {
        id: true,
        title: true,
        price: true,
        photo: true,
        created_at: true,
        views: true,
        location: true,
        status: true,
        type: true,
        latitude: true,
        longitude: true,
        street: true,
        city: true,
        state: true,
        postalCode: true,
        countryCode: true,
        categoryMain: true,
        categorySub: true,
        categorySubSub: true,
        productLikes: { select: { id: true, userId: true, productId: true } },
      },
      orderBy: [{ created_at: "desc" }, { id: "desc" }],
      take: PAGE_SIZE,
    });
    return {
      items: rows.map((r) =>
        normalizeProductRow({ ...r, productLikes: r.productLikes } as RawRow)
      ),
      user,
    };
  }

  const { latitude: lat, longitude: lon, radius: radiusKm } = user;
  const bbox = bboxFrom(lat!, lon!, radiusKm!);
  const rows = await rawNearbyProducts({
    lat: lat!,
    lon: lon!,
    radiusKm: radiusKm!,
    bbox,
    limit: PAGE_SIZE,
    includeDistance: false,
    categoryIds: cats,
  });

  return { items: rows.map(normalizeProductRow), user };
}
