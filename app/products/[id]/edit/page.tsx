import { notFound } from "next/navigation";
import db from "@/lib/db";
import {getSession} from "@/lib/session";
import EditProductForm from "@/components/EditProductForm";

export default async function EditPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) return notFound();

  const session = await getSession();
  if (!session.id) return notFound();

  const product = await db.product.findUnique({
    where: { id },
    include: { photos: true },
  });

  if (!product || product.userId !== session.id) return notFound();

  return <EditProductForm product={product} />;
}
