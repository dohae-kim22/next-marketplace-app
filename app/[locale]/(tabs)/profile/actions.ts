"use server";

import { redirect } from "@/i18n/navigation";
import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { getLocale } from "next-intl/server";

export async function logOut() {
  const locale = await getLocale();
  const session = await getSession();
  session.destroy();
  redirect({
    href: "/",
    locale,
  });
}

export async function getUserWithContent() {
  const session = await getSession();
  if (!session?.id) return null;

  const user = await db.user.findUnique({
    where: { id: session.id },
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
      posts: {
        orderBy: { created_at: "desc" },
        select: {
          id: true,
          title: true,
          description: true,
          photo: true,
          created_at: true,
          views: true,
          _count: {
            select: {
              postLikes: true,
              comments: true,
            },
          },
        },
      },
    },
  });

  return user;
}
