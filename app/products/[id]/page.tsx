import db from "@/lib/db";
import getSession from "@/lib/session";
import Image from "next/image";
import { notFound } from "next/navigation";
import { UserIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { formatToEuro } from "@/lib/utils";
import { PaperAirplaneIcon, TrashIcon } from "@heroicons/react/24/outline";
import ProductImageSlider from "@/components/ProductImageSlider";

async function getProduct(id: number) {
  const product = await db.product.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          userName: true,
          avatar: true,
        },
      },
      photos: {
        select: { url: true },
      },
    },
  });

  return product;
}

async function getIsOwner(userId: number) {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }
  return false;
}

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);

  if (isNaN(numericId)) {
    return notFound();
  }

  const product = await getProduct(numericId);

  if (!product) {
    return notFound();
  }

  const isOwner = await getIsOwner(product.userId);

  return (
    <div className="flex flex-col gap-3 p-5">
      <div className="relative aspect-square rounded-md overflow-hidden">
        <ProductImageSlider photos={product.photos} />
      </div>
      <div className="flex gap-2 items-center border-neutral-700 border-b pb-3">
        <div className="flex justify-center items-center size-12 rounded-full bg-neutral-700 overflow-hidden">
          {product.user.avatar !== null ? (
            <Image
              src={product.user.avatar}
              width={48}
              height={48}
              alt={product.user.userName}
            />
          ) : (
            <UserIcon className="size-8" />
          )}
        </div>
        <div>
          <h3>{product.user.userName}</h3>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold">{product.title}</h1>
        <p className="text-sm whitespace-pre-line">{product.description}</p>
      </div>
      <div className="fixed w-full bottom-0 p-5 left-0 bg-neutral-800 flex justify-between items-center">
        <span className="font-semibold text-xl">
          €{formatToEuro(product.price)}
        </span>
        {isOwner ? (
          <button className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold hover:bg-red-400 flex gap-1 justify-center items-center">
            <TrashIcon className="h-5" />
            <span>Delete</span>
          </button>
        ) : (
          <Link
            className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold hover:bg-orange-400 flex gap-1 justify-center items-center"
            href={``}
          >
            <PaperAirplaneIcon className="h-5" />
            <span>Ask seller</span>
          </Link>
        )}
      </div>
    </div>
  );
}
