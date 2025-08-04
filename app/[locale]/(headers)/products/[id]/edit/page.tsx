import { notFound } from "next/navigation";
import db from "@/lib/db";
import { getSession } from "@/lib/session";
import EditProductForm from "@/components/EditProductForm";

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);
  if (isNaN(numericId)) return notFound();

  const session = await getSession();
  if (!session.id) return notFound();

  const product = await db.product.findUnique({
    where: { id: numericId },
    include: { photos: true },
  });

  if (!product || product.userId !== session.id) return notFound();

  return <EditProductForm product={product} />;
}
