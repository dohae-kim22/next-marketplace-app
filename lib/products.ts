import { ListProductProps, RawRow } from "./types/product";

export function normalizeProductRow(row: RawRow): ListProductProps {
  return {
    ...row,
    productLikes: Array.isArray(row.productLikes) ? row.productLikes : [],
  };
}

export function bboxFrom(lat: number, lon: number, radiusKm: number) {
  const latDelta = radiusKm / 111.0;
  const lonDelta = radiusKm / (111.320 * Math.cos((lat * Math.PI) / 180));
  return {
    minLat: lat - latDelta,
    maxLat: lat + latDelta,
    minLon: lon - lonDelta,
    maxLon: lon + lonDelta,
  };
}