import { formatToEuro, formatToTimeAgo } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface ListProductProps {
  title: string;
  price: number;
  id: number;
  photo: string;
  created_at: Date;
}

export default function ListProduct({
  title,
  price,
  id,
  photo,
  created_at,
}: ListProductProps) {
  return (
    <Link href={`/products/${id}`} className="flex gap-5">
      <div className="relative size-28 overflow-hidden bg-neutral-700 rounded-md shrink-0">
        <Image
          fill
          src={`${photo}/avatar`}
          alt={title}
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-1 *:text-white flex-1">
        <span className="text-lg">{title}</span>
        <span className="text-xs">
          {formatToTimeAgo(created_at.toString())}
        </span>
        <span className="text-lg font-semibold">€{formatToEuro(price)}</span>
      </div>
    </Link>
  );
}
