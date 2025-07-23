"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

export async function deleteProduct(productId: number) {
  const session = await getSession();

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

  redirect("/products");
}

export async function toggleSoldStatus(productId: number) {
  const session = await getSession();

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

  redirect(`/products/${productId}`);
}
