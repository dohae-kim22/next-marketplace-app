import db from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import { formatToTimeAgo } from "@/lib/utils";
import ListProduct from "@/components/ListProduct";

interface Props {
  params: { id: string };
}

export default async function UserProfilePage({ params }: Props) {
  const id = Number(params.id);
  if (isNaN(id)) return notFound();

  const user = await db.user.findUnique({
    where: { id },
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
          status: true,
          type: true,
        },
      },
    },
  });

  if (!user) return notFound();

  return (
    <div className="p-5 space-y-6">
      <div className="flex items-center gap-4">
        <div className="size-16 rounded-full overflow-hidden bg-neutral-700">
          <Image
            src={user.avatar || "/default-avatar.png"}
            alt={user.userName}
            width={64}
            height={64}
            className="w-full h-full object-cover aspect-square"
          />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">{user.userName}</h1>
          <p className="text-sm text-neutral-400">
            Joined {formatToTimeAgo(user.created_at.toISOString())}
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-white mb-2">
          Products by {user.userName}
        </h2>
        {user.products.length === 0 ? (
          <p className="text-neutral-500">No products available.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {user.products.map((product) => (
              <ListProduct key={product.id} {...product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
