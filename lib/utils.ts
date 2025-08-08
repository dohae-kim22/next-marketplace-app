export function formatToEuro(price: number) {
  return price.toLocaleString("fr-FR");
}

export function formatToTimeAgo(date: string, locale: string = "en") {
  const now = new Date().getTime();
  const target = new Date(date).getTime();
  const diffInMs = target - now;

  const seconds = Math.round(diffInMs / 1000);
  const minutes = Math.round(diffInMs / (1000 * 60));
  const hours = Math.round(diffInMs / (1000 * 60 * 60));
  const days = Math.round(diffInMs / (1000 * 60 * 60 * 24));
  const months = Math.round(diffInMs / (1000 * 60 * 60 * 24 * 30));
  const years = Math.round(diffInMs / (1000 * 60 * 60 * 24 * 365));

  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (Math.abs(seconds) < 60) {
    return formatter.format(seconds, "second");
  } else if (Math.abs(minutes) < 60) {
    return formatter.format(minutes, "minute");
  } else if (Math.abs(hours) < 24) {
    return formatter.format(hours, "hour");
  } else if (Math.abs(days) < 30) {
    return formatter.format(days, "day");
  } else if (Math.abs(months) < 12) {
    return formatter.format(months, "month");
  } else {
    return formatter.format(years, "year");
  }
}

export function formatDateString(date: Date, locale: string = "en") {
  const formatted = date
    .toLocaleString(locale === "fr" ? "fr-FR" : "en-GB", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(",", "");

  return formatted;
}

export function formatShortAddress({
  city,
  postalCode,
  location,
}: {
  city?: string;
  postalCode?: string;
  location: string;
}): string {
  if (postalCode && city) return `${postalCode} ${city}, France`;
  const parts = location.split(",");
  if (parts.length < 2) return location.trim();

  const lastTwo = parts.slice(-2).map((part) => part.trim());
  lastTwo[lastTwo.length - 1] = "France";

  return lastTwo.join(", ");
}

export function formatFullAddress({
  street,
  postalCode,
  city,
  location,
}: {
  street?: string | null;
  postalCode?: string | null;
  city?: string | null;
  location: string;
}): string {
  const hasStreet = street && street.trim() !== "";
  const hasCityPostal =
    postalCode && postalCode.trim() !== "" && city && city.trim() !== "";

  if (hasStreet && hasCityPostal) {
    return `${street}, ${postalCode} ${city}, France`;
  }

  if (!hasStreet && hasCityPostal) {
    return `${postalCode} ${city}, France`;
  }

  const parts = location.split(",");
  if (parts.length === 0) return "France";

  parts[parts.length - 1] = "France";
  return parts.map((p) => p.trim()).join(", ");
}

// Haversine formula to calculate distance between two coordinates
export function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const PAGE_SIZE = 20;
