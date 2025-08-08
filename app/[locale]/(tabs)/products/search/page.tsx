import FormInput from "@/components/FormInput";
import db from "@/lib/db";
import LoadMoreSearchedProducts from "@/components/LoadMoreSearchedProducts";
import { PAGE_SIZE } from "@/lib/utils";

interface ProductSearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function ProductSearchPage({
  searchParams,
}: ProductSearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  if (!query) {
    return (
      <div className="container-lg p-5 flex flex-col gap-3 mb-30">
        <form className="mb-4 lg:hidden">
          <FormInput
            type="text"
            name="q"
            defaultValue=""
            placeholder="Search products..."
          />
        </form>
        <p className="text-white">Type something to search.</p>
      </div>
    );
  }

  const items = await db.product.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    },
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
    orderBy: { created_at: "desc" },
    distinct: ["id"],
    take: PAGE_SIZE,
  });

  return (
    <div className="container-lg p-5 flex flex-col gap-3 mb-30">
      <form className="mb-4 lg:hidden">
        <FormInput
          type="text"
          name="q"
          defaultValue={query}
          placeholder="Search products..."
        />
      </form>

      {items.length === 0 ? (
        <p className="text-white">No products found.</p>
      ) : (
        <LoadMoreSearchedProducts initialItems={items as any} query={query} />
      )}
    </div>
  );
}
