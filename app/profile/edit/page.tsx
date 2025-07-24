import getSession from "@/lib/session";
import db from "@/lib/db";
import { notFound } from "next/navigation";
import EditProfileForm from "@/components/EditProfileForm";

export default async function EditProfilePage() {
  const session = await getSession();
  if (!session?.id) return notFound();

  const user = await db.user.findUnique({
    where: { id: session.id },
  });

  if (!user) return notFound();

  return <EditProfileForm user={user} />;
}
