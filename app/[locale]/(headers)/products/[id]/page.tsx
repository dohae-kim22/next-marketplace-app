import db from "@/lib/db";
import { getIsOwner, getSession } from "@/lib/session";
import Image from "next/image";
import { notFound } from "next/navigation";
import { UserIcon } from "@heroicons/react/24/solid";
import { Link } from "@/i18n/navigation";
import { formatDateString, formatFullAddress, formatToEuro } from "@/lib/utils";
import {
  CheckCircleIcon,
  EyeIcon,
  PaperAirplaneIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import ProductImageSlider from "@/components/ProductImageSlider";
import LocationMap from "@/components/LocationMap";
import CopyButton from "@/components/CopyButton";
import { deleteProduct, toggleSoldStatus } from "./actions";
import LikeButton from "@/components/LikeButton";
import { createOrGetChatRoom } from "@/app/[locale]/(headers)/chats/actions";
import CategoryBreadcrumb from "@/components/CategoryBreadcrumb";
import { findCategorySlugsByIds } from "@/lib/categoryUtils";
import DeleteProductButton from "@/components/DeleteProductButton";
import { getTranslations } from "next-intl/server";
import ScrollToTop from "@/components/ScrollToTop";

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

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  const numericId = Number(id);

  if (isNaN(numericId)) {
    return notFound();
  }

  const product = await getProduct(numericId);

  if (!product) {
    return notFound();
  }

  const t = await getTranslations("productDetail");

  const categoryIdPath = [product.categoryMain];
  if (product.categorySub) categoryIdPath.push(product.categorySub);
  if (product.categorySubSub) categoryIdPath.push(product.categorySubSub);

  const slug = findCategorySlugsByIds(categoryIdPath);

  const isOwner = await getIsOwner(product.userId);

  return (
    <div className="container-lg flex flex-col gap-3 p-5 md:p-20 md:py-0 md:pt-5 lg:py-8 lg:px-5 lg:flex-row lg:gap-15">
      <ScrollToTop />
      <div className="flex flex-col gap-3">
        <CategoryBreadcrumb slug={slug} />
        <div className="relative overflow-hidden">
          <ProductImageSlider photos={product.photos} />
        </div>
        <div className="flex gap-2 items-center border-neutral-700 border-b pb-3">
          <Link
            href={`/users/${product.userId}`}
            className="flex gap-2 items-center flex-1"
          >
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
              <h3 className="text-white font-semibold">
                {product.user.userName}
              </h3>
            </div>
          </Link>
          {product.type === "FREE" && product.status === "ON_SALE" && (
            <div className="bg-teal-500 opacity-90 px-2 rounded-md font-medium text-sm lg:text-base">
              {t("freeGiveaway")}
            </div>
          )}
          {product.type === "WANTED" && product.status === "ON_SALE" && (
            <div className="bg-indigo-500 opacity-90 px-2 rounded-md font-medium text-sm lg:text-base">
              {t("wanted")}
            </div>
          )}
          {product.status === "SOLD" && (
            <div className="bg-red-500 opacity-90 px-2 rounded-md font-medium text-sm lg:text-base">
              {t("soldOut")}
            </div>
          )}
        </div>

        {isOwner ? (
          <div className="hidden mt-3 lg:flex flex-col gap-2">
            <Link
              href={`/products/${product.id}/edit`}
              className="bg-transparent p-2.5 rounded-full text-white font-semibold hover:bg-neutral-700 flex justify-center items-center cursor-pointer border-2 border-neutral-700 gap-2 transition-colors"
            >
              <PencilIcon className="h-6" />
              <span>{t("editListing")}</span>
            </Link>
            <DeleteProductButton
              productId={product.id}
              action={deleteProduct.bind(null, product.id)}
              isMobile={false}
            />
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 flex-1">
        <div className="flex gap-1 *:text-xs *:text-neutral-400 lg:*:text-sm">
          <span className="flex-1">
            {formatDateString(product.created_at, locale)}
          </span>
          <div className="flex gap-1">
            <EyeIcon className="size-4 lg:size-5" />
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
          <h1 className="text-3xl font-semibold">{product.title}</h1>
          <div className={`flex flex-col gap-3 ${isOwner ? "my-3" : "my-1"}`}>
            <span
              className={`font-semibold text-2xl flex-1 ${
                !isOwner ? "hidden lg:block" : ""
              }`}
            >
              €{formatToEuro(product.price)}
            </span>

            <div className="hidden lg:block">
              {isOwner ? (
                <form action={toggleSoldStatus.bind(null, product.id)}>
                  <button className="bg-transparent px-2.5 py-2 rounded-md text-white font-semibold flex gap-1 justify-center items-center cursor-pointer border-2 border-neutral-700 hover:bg-neutral-700 transition-colors">
                    <CheckCircleIcon className="h-6" />
                    <span>
                      {product.status === "SOLD"
                        ? t("markAsAvailable")
                        : t("markAsSold")}
                    </span>
                  </button>
                </form>
              ) : (
                <form action={createOrGetChatRoom}>
                  <input type="hidden" name="productId" value={product.id} />
                  <button
                    disabled={product.status === "SOLD"}
                    className="bg-orange-500 px-5 py-2 rounded-md text-white font-semibold hover:bg-orange-600 transition-colors flex gap-1 justify-center items-center disabled:bg-neutral-600 disabled:cursor-not-allowed disabled:hover:bg-neutral-600 cursor-pointer"
                  >
                    <PaperAirplaneIcon className="h-5" />
                    <span>{t("askSeller")}</span>
                  </button>
                </form>
              )}
            </div>
          </div>

          <p className="text-sm mt-3 whitespace-pre-line lg:text-base">
            {product.description}
          </p>

          {product.location && (
            <div className="mt-5 flex flex-col gap-2 md:mt-7">
              <h2 className="text-sm text-neutral-400 font-semibold">
                {t("meetupLocation")}
              </h2>
              <div className="flex items-center justify-between">
                <p className="text-sm lg:text-base">
                  {formatFullAddress({
                    street: product.street ?? "",
                    postalCode: product.postalCode ?? "",
                    city: product.city ?? "",
                    location: product.location,
                  })}
                </p>
                <CopyButton value={product.location} />
              </div>
              <LocationMap lat={product.latitude} lng={product.longitude} />
            </div>
          )}
        </div>

        <div
          className="lg:hidden"
          style={{ height: "calc(64px + env(safe-area-inset-bottom))" }}
        />

        <div
          className="fixed inset-x-0 bottom-0 z-50 w-full left-0 bg-neutral-800 flex gap-2 items-center lg:hidden"
          style={{
            paddingLeft: "1.25rem",
            paddingRight: "1.25rem",
            paddingTop: "1.25rem",
            paddingBottom: "calc(1.25rem + env(safe-area-inset-bottom))",
          }}
        >
          <span
            className={`font-semibold text-xl flex-1 ${
              isOwner ? "hidden" : ""
            }`}
          >
            €{formatToEuro(product.price)}
          </span>

          {isOwner ? (
            <>
              <DeleteProductButton
                productId={product.id}
                action={deleteProduct.bind(null, product.id)}
                isMobile={true}
              />
              <Link
                href={`/products/${product.id}/edit`}
                className="bg-transparent p-2.5 rounded-full text-white font-semibold hover:bg-neutral-700 flex justify-center items-center cursor-pointer border-2 transition-colors border-neutral-700"
              >
                <PencilIcon className="h-6" />
              </Link>
              <form
                action={toggleSoldStatus.bind(null, product.id)}
                className="ml-auto"
              >
                <button className="bg-transparent p-2.5 rounded-md text-white font-semibold flex gap-1 justify-end items-center cursor-pointer border-2 border-neutral-700 hover:bg-neutral-700 transition-colors">
                  <CheckCircleIcon className="h-6" />
                  <span>
                    {product.status === "SOLD"
                      ? t("markAsAvailable")
                      : t("markAsSold")}
                  </span>
                </button>
              </form>
            </>
          ) : (
            <form action={createOrGetChatRoom} className="ml-auto">
              <input type="hidden" name="productId" value={product.id} />
              <button
                disabled={product.status === "SOLD"}
                className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold hover:bg-orange-600 transition-colors flex gap-1 justify-center items-center disabled:bg-neutral-600 disabled:cursor-not-allowed disabled:hover:bg-neutral-600"
              >
                <PaperAirplaneIcon className="h-5" />
                <span>Ask seller</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
