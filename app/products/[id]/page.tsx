import db from "@/lib/db";
import getSession from "@/lib/session";
import Image from "next/image";
import { notFound } from "next/navigation";
import { UserIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { formatDateString, formatToEuro } from "@/lib/utils";
import {
  CheckCircleIcon,
  EyeIcon,
  PaperAirplaneIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import ProductImageSlider from "@/components/ProductImageSlider";
import LocationMap from "@/components/LocationMap";
import CopyButton from "@/components/CopyButton";
import { deleteProduct, toggleSoldStatus } from "./actions";
import LikeButton from "@/components/LikeButton";

async function getProduct(id: number) {
  const session = await getSession();
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
      productLikes: true,
    },
  });

  if (!product) return null;

  await db.product.update({
    where: { id },
    data: {
      views: { increment: 1 },
    },
  });

  const isLiked = product.productLikes.some(
    (like) => like.userId === session?.id
  );
  
  return {
    ...product,
    isLiked,
    likeCount: product.productLikes.length,
  };
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
      <div>
        <div className="relative aspect-square overflow-hidden">
          <ProductImageSlider photos={product.photos} />
        </div>
        {product.status === "SOLD" && (
          <div className="bg-green-500 flex justify-end py-1 px-2 rounded-b-md">
            <span className="font-semibold">{product.status}</span>
          </div>
        )}
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
        <div className="flex-1">
          <h3>{product.user.userName}</h3>
        </div>
      </div>

      <div className="flex gap-1 *:text-xs *:text-neutral-400">
        <span className="flex-1">{formatDateString(product.created_at)}</span>
        <div className="flex gap-1">
          <EyeIcon className="size-4" />
          <span>{product.views}</span>
        </div>
        <div className="flex gap-1">
          <LikeButton
            productId={product.id}
            isLiked={product.isLiked}
            likeCount={product.likeCount}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 mb-25">
        <h1 className="text-xl font-semibold">{product.title}</h1>
        <p className="text-sm whitespace-pre-line">{product.description}</p>
        {product.location && (
          <div className="mt-4 flex flex-col gap-2">
            <h2 className="text-sm text-neutral-400 font-semibold">
              Meet-up Location
            </h2>
            <div className="flex items-center justify-between">
              <p className="text-sm">{product.location}</p>
              <CopyButton value={product.location} />
            </div>
            <LocationMap lat={product.latitude} lng={product.longitude} />
          </div>
        )}
      </div>

      <div className="fixed w-full bottom-0 p-5 left-0 bg-neutral-800 flex gap-2 items-center">
        <span className="font-semibold text-xl flex-1">
          €{formatToEuro(product.price)}
        </span>

        {isOwner ? (
          <>
            <form action={deleteProduct.bind(null, product.id)}>
              <button className="bg-transparent p-2.5 rounded-full text-red-500 font-semibold hover:bg-neutral-700 flex justify-center items-center cursor-pointer border-2 border-neutral-700">
                <TrashIcon className="h-6" />
              </button>
            </form>
            <Link
              href={`/products/${product.id}/edit`}
              className="bg-transparent p-2.5 rounded-full text-white font-semibold hover:bg-neutral-700 flex justify-center items-center cursor-pointer border-2 border-neutral-700"
            >
              <PencilIcon className="h-6" />
            </Link>
            <form action={toggleSoldStatus.bind(null, product.id)}>
              <button
                className={`bg-transparent p-2.5 rounded-md text-white font-semibold flex gap-1 justify-center items-center cursor-pointer border-2 border-neutral-700 hover:bg-neutral-700`}
              >
                <CheckCircleIcon className="h-6" />
                <span>
                  {product.status === "SOLD"
                    ? "Mark as Available"
                    : "Mark as Sold"}
                </span>
              </button>
            </form>
          </>
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
