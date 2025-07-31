"use client";

import Link from "next/link";

interface LocationBannerProps {
  location?: string;
  radius?: number;
}

export default function LocationBanner({
  location,
  radius,
}: LocationBannerProps) {
  const hasLocation = location && radius;

  return (
    <div className="flex justify-between items-center bg-neutral-800 text-sm text-white px-4 py-2 rounded-md">
      <span>
        {hasLocation
          ? `📍 ${location} • ${radius}km`
          : `📍 Showing all locations`}
      </span>

      {!hasLocation && (
        <Link
          href="/profile/edit"
          className="text-xs text-orange-400 hover:underline"
        >
          Set location
        </Link>
      )}
    </div>
  );
}
