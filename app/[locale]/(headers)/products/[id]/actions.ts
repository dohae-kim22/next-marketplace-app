"use server";

import { redirect } from "@/i18n/navigation";
import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { getLocale } from "next-intl/server";

export async function deleteProduct(productId: number) {
  const session = await getSession();
  const locale = await getLocale();

  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
    select: {
      userId: true,
    },
  });

  if (!product || product.userId !== session.id) {
    throw new Error("Unauthorized");
  }

  await db.product.delete({
    where: {
      id: productId,
    },
  });

  redirect({
    href: "/products",
    locale,
  });
}

export async function toggleSoldStatus(productId: number) {
  const session = await getSession();
  const locale = await getLocale();

  const product = await db.product.findUnique({
    where: { id: productId },
    select: { userId: true, status: true },
  });

  if (!product || product.userId !== session.id) {
    throw new Error("Unauthorized");
  }

  const newStatus = product.status === "SOLD" ? "ON_SALE" : "SOLD";

  await db.product.update({
    where: { id: productId },
    data: { status: newStatus },
  });

  redirect({
    href: `/products/${productId}`,
    locale,
  });
}

export async function toggleLike(productId: number) {
  const session = await getSession();
  if (!session?.id) return;

  const existing = await db.productLike.findFirst({
    where: { productId, userId: session.id },
  });

  if (existing) {
    await db.productLike.delete({ where: { id: existing.id } });
  } else {
    await db.productLike.create({
      data: { productId, userId: session.id },
    });
  }
}
