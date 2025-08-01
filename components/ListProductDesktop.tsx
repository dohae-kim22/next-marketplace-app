import {
  ProductLike,
  ProductStatus,
  ProductType,
} from "@/lib/generated/prisma";
import { formatShortAddress, formatToEuro, formatToTimeAgo } from "@/lib/utils";
import { EyeIcon, HeartIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

interface ListProductProps {
  title: string;
  price: number;
  id: number;
  photo: string;
  location: string;
  views: number;
  productLikes: ProductLike[];
  created_at: Date;
  status: ProductStatus;
  type: ProductType;
}

export default function ListProductDesktop({
  title,
  price,
  id,
  location,
  photo,
  created_at,
  productLikes,
  views,
  status,
  type,
}: ListProductProps) {
  return (
    <Link
      href={`/products/${id}`}
      className="flex flex-col bg-neutral-800 rounded-xl overflow-hidden border border-neutral-700 hover:scale-105 transition-transform"
    >
      <div className="relative w-full aspect-square bg-neutral-700">
        <Image
          fill
          src={`${photo}/public`}
          alt={title}
          className="object-cover"
        />
        {status === "SOLD" && (
          <div className="absolute bottom-2 left-2 text-sm font-bold bg-neutral-600 px-2 py-1 opacity-80 text-neutral-300 rounded">
            SOLD
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1 p-3 text-white">
        <span className="text-lg font-semibold line-clamp-1">{title}</span>
        <span className="text-xs text-neutral-400">
          {formatShortAddress(location)}
        </span>
        <span className="text-xs text-neutral-500">
          {formatToTimeAgo(created_at.toString())}
        </span>

        <div className="flex items-center justify-between mt-2">
          {type === "SALE" ? (
            <div className="text-lg font-semibold">€{formatToEuro(price)}</div>
          ) : (
            <span className="bg-teal-500 opacity-90 px-2 rounded-md font-medium text-sm">
              Free Giveaway
            </span>
          )}
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
