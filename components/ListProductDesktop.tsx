"use client";

import {
  ProductLike,
  ProductStatus,
  ProductType,
} from "@/lib/generated/prisma";
import { formatShortAddress, formatToEuro, formatToTimeAgo } from "@/lib/utils";
import { EyeIcon, HeartIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";

interface ListProductProps {
  title: string;
  price: number;
  id: number;
  photo: string;
  location: string;
  views: number;
  street: string | null;
  postalCode: string | null;
  state: string | null;
  countryCode: string | null;
  city: string | null;
  productLikes: ProductLike[];
  created_at: Date;
  status: ProductStatus;
  type: ProductType;
}

export default function ListProductDesktop({
  title,
  price,
  id,
  city,
  postalCode,
  location,
  photo,
  created_at,
  productLikes,
  views,
  status,
  type,
  index,
}: ListProductProps & { index?: number }) {
  const locale = useLocale();
  const t = useTranslations("listProduct");
  const isLcp = index === 0;

  return (
    <Link
      href={`/products/${id}`}
      className="flex flex-col bg-neutral-800 rounded-xl overflow-hidden border border-neutral-700 hover:scale-105 transition-transform"
    >
      <div className="relative w-full aspect-square bg-neutral-50">
        <Image
          fill
          src={`${photo}/public`}
          alt={title}
          className="object-cover"
          priority={isLcp}
          sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, 100vw"
        />
        {status === "SOLD" && (
          <div className="absolute bottom-0 left-0 text-base font-bold bg-neutral-600 px-2 py-1 opacity-80 text-neutral-300">
            {t("sold")}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1 p-3 text-white">
        <span className="text-base font-semibold line-clamp-1">{title}</span>
        <span className="text-xs text-neutral-400">
          {formatShortAddress({
            city: city ?? "",
            postalCode: postalCode ?? "",
            location,
          })}
        </span>
        <span className="text-xs text-neutral-500">
          {formatToTimeAgo(created_at.toString(), locale)}
        </span>

        <div className="flex items-center justify-between mt-2">
          {type === "SALE" ? (
            <div className="text-lg font-semibold">€{formatToEuro(price)}</div>
          ) : type === "FREE" ? (
            <span className="bg-teal-500 opacity-90 px-2 rounded-md font-medium text-sm">
              {t("free")}
            </span>
          ) : type === "WANTED" ? (
            <span className="bg-indigo-500 opacity-90 px-2 rounded-md font-medium text-sm">
              {t("wanted")}
            </span>
          ) : null}

          <div className="flex gap-3 text-xs text-neutral-400">
            <span className="flex items-center gap-1">
              <EyeIcon className="size-4" /> {views}
            </span>
            <span className="flex items-center gap-1">
              <HeartIcon className="size-4 text-red-400" />{" "}
              {productLikes.length}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
