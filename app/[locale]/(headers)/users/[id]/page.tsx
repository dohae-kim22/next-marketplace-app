import db from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import { formatToTimeAgo } from "@/lib/utils";
import ListProduct from "@/components/ListProduct";
import { getSession } from "@/lib/session";
import { ChatButton } from "@/components/ChatButton";
import { getReceivedReviews } from "@/lib/reviews";
import { redirect } from "@/i18n/navigation";
import ScrollToTop from "@/components/ScrollToTop";
import ToggleSection from "@/components/ToggleSection";
import { getTranslations } from "next-intl/server";

interface UserProfileProps {
  params: Promise<{ id: string; locale: string }>;
}

export default async function UserProfile({ params }: UserProfileProps) {
  const { id, locale } = await params;
  const numericId = Number(id);

  const t = await getTranslations("userProfile");

  if (isNaN(numericId)) return notFound();

  const session = await getSession();

  if (session?.id === numericId) {
    return redirect({
      href: "/profile",
      locale,
    });
  }

  const user = await db.user.findUnique({
    where: { id: numericId },
    include: {
      products: {
        orderBy: { created_at: "desc" },
        select: {
          id: true,
          title: true,
          price: true,
          photo: true,
          created_at: true,
          views: true,
          productLikes: true,
          location: true,
          city: true,
          street: true,
          postalCode: true,
          state: true,
          countryCode: true,
          status: true,
          type: true,
        },
      },
    },
  });

  if (!user) return notFound();

  const reviews = await getReceivedReviews(numericId);

  return (
    <div className="container-lg p-5 mb-30 flex flex-col gap-7 md:p-20 md:pt-0 md:mb-10 lg:p-50 lg:pt-10">
      <ScrollToTop />
      <div className="flex items-center gap-4">
        <div className="relative size-18 shrink-0 rounded-full overflow-hidden bg-neutral-700">
          <Image
            src={user.avatar || "/default-avatar.png"}
            alt={user.userName}
            fill
            sizes="72px"
            className="object-cover"
          />
        </div>
        <div className="flex justify-between items-center w-full">
          <div>
            <h1 className="text-xl font-bold text-white">{user.userName}</h1>
            <p className="text-sm text-neutral-400">
              {t("joined", {
                timeAgo: formatToTimeAgo(user.created_at.toISOString(), locale),
              })}
            </p>
          </div>
          <ChatButton userId={user.id} />
        </div>
      </div>

      <ToggleSection title={t("reviews")}>
        {reviews.length === 0 ? (
          <p className="text-neutral-500">{t("noReviews")}</p>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="bg-neutral-800 p-4 rounded-lg flex gap-4 items-start"
            >
              <Image
                src={review.reviewer.avatar ?? "/default-user.png"}
                alt={review.reviewer.userName}
                width={40}
                height={40}
                className="rounded-full size-10"
              />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">
                    {review.reviewer.userName}
                  </span>
                  <span className="text-yellow-400 text-sm">
                    {"★".repeat(review.rating)} {"☆".repeat(5 - review.rating)}
                  </span>
                </div>
                <p className="text-sm text-neutral-300 mt-1">
                  {review.comment}
                </p>
                <p className="text-xs text-neutral-500 mt-1 line-clamp-1">
                  Product: <strong>{review.product.title}</strong>
                </p>
              </div>
            </div>
          ))
        )}
      </ToggleSection>

      <ToggleSection title={t("productsBy", { name: user.userName })}>
        {user.products.length === 0 ? (
          <p className="text-neutral-500">{t("noProducts")}</p>
        ) : (
          user.products.map((product) => (
            <ListProduct key={product.id} {...product} />
          ))
        )}
      </ToggleSection>
    </div>
  );
}
