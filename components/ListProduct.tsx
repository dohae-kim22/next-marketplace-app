import { ProductLike } from "@/lib/generated/prisma";
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
}

export default function ListProduct({
  title,
  price,
  id,
  location,
  photo,
  created_at,
  productLikes,
  views,
}: ListProductProps) {
  return (
    <Link
      href={`/products/${id}`}
      className="flex gap-5 border-b-1 border-neutral-700 pb-3"
    >
      <div className="relative size-28 overflow-hidden bg-neutral-700 rounded-md shrink-0">
        <Image
          fill
          src={`${photo}/avatar`}
          alt={title}
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-1 *:text-white flex-1">
        <div className="flex flex-col flex-1 gap-1">
          <span className="text-lg">{title}</span>
          <span className="text-xs">{formatShortAddress(location)}</span>
          <span className="text-xs">
            {formatToTimeAgo(created_at.toString())}
          </span>
        </div>
        <div className="flex items-end gap-2">
          <div className="text-lg font-semibold flex-1 leading-none">
            €{formatToEuro(price)}
          </div>
          <div className="flex gap-1 text-xs justify-center items-center">
            <EyeIcon className="size-4" />
            <span>{views}</span>
          </div>
          <div className="flex gap-1 text-xs justify-center items-center">
            <HeartIcon className="size-4" />
            <span>{productLikes.length}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
