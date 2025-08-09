"use server";

import db from "@/lib/db";
import { bboxFrom, normalizeProductRow } from "@/lib/products";
import { getUserWithLocation } from "@/lib/session";
import { rawNearbyProducts } from "@/lib/sql/productRaw";
import type { ListProductProps, RawRow } from "@/lib/types/product";
import { PAGE_SIZE } from "@/lib/utils";

export async function getMoreProducts(
  page: number
): Promise<ListProductProps[]> {
  const skip = page * PAGE_SIZE;
  const user = await getUserWithLocation();

  if (!user?.latitude || !user.longitude || !user.radius) {
    const rows = await db.product.findMany({
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
  });

  return rows.map(normalizeProductRow);
}

export async function getMoreSearchedProducts(
  page: number,
  query: string
): Promise<ListProductProps[]> {
  const skip = page * PAGE_SIZE;
  if (!query?.trim()) return [];
  const user = await getUserWithLocation();

  if (!user?.latitude || !user.longitude || !user.radius) {
    const rows = await db.product.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { city: { contains: query, mode: "insensitive" } },
        ],
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
    searchLike: `%${query}%`,
    includeDistance: false,
  });

  return rows.map(normalizeProductRow);
}

export async function getFirstProductPage(): Promise<{
  items: ListProductProps[];
  user: any;
}> {
  const user = await getUserWithLocation();

  if (!user?.latitude || !user.longitude || !user.radius) {
    const rows = await db.product.findMany({
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
  });

  return { items: rows.map(normalizeProductRow), user };
}

export async function getFirstSearchPage(
  query: string
): Promise<ListProductProps[]> {
  const user = await getUserWithLocation();

  if (!user?.latitude || !user.longitude || !user.radius) {
    const rows = await db.product.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { city: { contains: query, mode: "insensitive" } },
        ],
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
        productLikes: { select: { id: true, userId: true, productId: true } },
      },
      orderBy: [{ created_at: "desc" }, { id: "desc" }],
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
    limit: PAGE_SIZE,
    searchLike: `%${query}%`,
    includeDistance: false,
  });

  return rows.map(normalizeProductRow);
}
