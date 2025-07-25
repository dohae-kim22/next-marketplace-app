export function formatToEuro(price: number) {
  return price.toLocaleString("fr-FR");
}

export function formatToTimeAgo(date: string) {
  const now = new Date().getTime();
  const target = new Date(date).getTime();
  const diffInMs = target - now;

  const seconds = Math.round(diffInMs / 1000);
  const minutes = Math.round(diffInMs / (1000 * 60));
  const hours = Math.round(diffInMs / (1000 * 60 * 60));
  const days = Math.round(diffInMs / (1000 * 60 * 60 * 24));
  const months = Math.round(diffInMs / (1000 * 60 * 60 * 24 * 30));
  const years = Math.round(diffInMs / (1000 * 60 * 60 * 24 * 365));

  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

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

export function formatDateString(date: Date) {
  const formatted = date
    .toLocaleString("en-GB", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(",", "");

  return formatted;
}

export function formatShortAddress(fullAddress: string): string {
  const parts = fullAddress.split(",");
  if (parts.length < 2) return fullAddress.trim();

  const lastTwo = parts.slice(-2).map((part) => part.trim());
  return lastTwo.join(", ");
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
