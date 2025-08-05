"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

interface LocationBannerProps {
  location?: string;
  radius?: number;
}

export default function LocationBanner({
  location,
  radius,
}: LocationBannerProps) {
  const t = useTranslations("locationBanner");
  const hasLocation = location && radius;

  return (
    <div className="flex justify-between items-center bg-neutral-800 text-sm text-white px-4 py-2 rounded-md my-3 lg:mt-10">
      <span>
        {hasLocation ? `📍 ${location} • ${radius}km` : t("showingAll")}
      </span>

      <Link
        href="/profile/edit"
        className="text-xs text-orange-400 hover:underline lg:text-sm"
      >
        {hasLocation ? t("editLocation") : t("setLocation")}
      </Link>
    </div>
  );
}
