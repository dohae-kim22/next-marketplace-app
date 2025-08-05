import {
  ProductLike,
  ProductStatus,
  ProductType,
} from "@/lib/generated/prisma";
import { formatShortAddress, formatToEuro, formatToTimeAgo } from "@/lib/utils";
import { EyeIcon, HeartIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

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

export default function ListProduct({
  title,
  price,
  id,
  location,
  city,
  postalCode,
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
      className="flex gap-5 border-b-1 border-neutral-700 pb-3 last:border-0"
    >
      <div className="relative size-28 overflow-hidden bg-neutral-700 shrink-0 rounded-sm">
        <Image
          fill
          src={`${photo}/avatar`}
          alt={title}
          className="object-cover"
        />
        {status === "SOLD" && (
          <div className="absolute z-1 bottom-0 text-sm font-bold bg-neutral-600 px-1 py-0.5 opacity-80 text-neutral-300">
            SOLD
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1 *:text-white flex-1">
        <div className="flex flex-col flex-1 gap-1">
          <span className="text-lg line-clamp-1">{title}</span>
          <span className="text-xs">
            {formatShortAddress({
              city: city ?? "",
              postalCode: postalCode ?? "",
              location,
            })}
          </span>
          <span className="text-xs text-neutral-500">
            {formatToTimeAgo(created_at.toString())}
          </span>
        </div>
        <div className="flex items-end gap-2">
          {type === "SALE" ? (
            <div className="text-lg font-semibold flex-1 leading-none">
              €{formatToEuro(price)}
            </div>
          ) : (
            <span className=" bg-teal-500 mr-auto opacity-90 px-2 rounded-md font-medium text-sm">
              Free Giveaway
            </span>
          )}
          <div className="flex gap-1 text-xs justify-center items-center">
            <EyeIcon className="size-4" />
            <span>{views}</span>
          </div>
          <div className="flex gap-1 text-xs justify-center items-center">
            <HeartIcon className="size-4 text-red-400" />
            <span>{productLikes.length}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
