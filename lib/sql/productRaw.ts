import db from "../db";
import { Prisma } from "../generated/prisma";
import { RawRow } from "../types/product";

export const PRODUCT_FIELDS = Prisma.sql`
  p.id, p.title, p.price, p.photo, p.created_at, p.views, p.location,
  p.status, p.type, p.latitude, p.longitude, p.street, p.city, p.state,
  p."postalCode", p."countryCode"
`;

export const GROUP_BY_FIELDS = Prisma.sql`
  p.id, p.title, p.price, p.photo, p.created_at, p.views, p.location,
  p.status, p.type, p.latitude, p.longitude, p.street, p.city, p.state,
  p."postalCode", p."countryCode"
`;

export const PRODUCT_LIKES_JSON = Prisma.sql`
  COALESCE(
    json_agg(
      json_build_object('id', pl.id, 'userId', pl."userId", 'productId', pl."productId")
    ) FILTER (WHERE pl.id IS NOT NULL),
    '[]'::json
  ) AS "productLikes"
`;

type BBox = { minLat: number; maxLat: number; minLon: number; maxLon: number };

export async function rawNearbyProducts(options: {
  lat: number;
  lon: number;
  radiusKm: number;
  bbox: BBox;
  limit: number;
  skip?: number;
  includeDistance?: boolean;
  searchLike?: string;
  categoryIds?: {
    mainId?: string | null;
    subId?: string | null;
    subSubId?: string | null;
  };
}) {
  const {
    lat,
    lon,
    radiusKm,
    bbox,
    limit,
    skip = 0,
    includeDistance = false,
    searchLike,
    categoryIds,
  } = options;

  const searchSql = searchLike
    ? Prisma.sql`AND (p.title ILIKE ${searchLike} OR p.description ILIKE ${searchLike} OR p.city ILIKE ${searchLike})`
    : Prisma.empty;

  const cat = categoryIds ?? {};
  const catSql = Prisma.sql`
    AND (${cat.mainId ?? null}::text   IS NULL OR p."categoryMain"   = ${
    cat.mainId ?? null
  }::text)
    AND (${cat.subId ?? null}::text    IS NULL OR p."categorySub"    = ${
    cat.subId ?? null
  }::text)
    AND (${cat.subSubId ?? null}::text IS NULL OR p."categorySubSub" = ${
    cat.subSubId ?? null
  }::text)
  `;

  const distanceSelect = includeDistance
    ? Prisma.sql`, (6371 * acos(
        cos(radians(${lat})) * cos(radians(p.latitude)) *
        cos(radians(p.longitude) - radians(${lon})) +
        sin(radians(${lat})) * sin(radians(p.latitude))
      )) AS distance`
    : Prisma.empty;

  const havingSql = Prisma.sql`
    HAVING (6371 * acos(
      cos(radians(${lat})) * cos(radians(p.latitude)) *
      cos(radians(p.longitude) - radians(${lon})) +
      sin(radians(${lat})) * sin(radians(p.latitude))
    )) <= ${radiusKm}
  `;

  const sql = Prisma.sql`
    SELECT
      ${PRODUCT_FIELDS}
      ${distanceSelect},
      ${PRODUCT_LIKES_JSON}
    FROM "Product" p
    LEFT JOIN "ProductLike" pl ON pl."productId" = p.id
    WHERE p.latitude IS NOT NULL
      AND p.longitude IS NOT NULL
      AND p.latitude  BETWEEN ${bbox.minLat} AND ${bbox.maxLat}
      AND p.longitude BETWEEN ${bbox.minLon} AND ${bbox.maxLon}
      ${catSql}
      ${searchSql}
    GROUP BY ${GROUP_BY_FIELDS}
    ${havingSql}
    ORDER BY p.created_at DESC, p.id DESC
    OFFSET ${skip}
    LIMIT ${limit};
  `;

  return db.$queryRaw<RawRow[]>(sql);
}
