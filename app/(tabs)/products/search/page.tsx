import FormInput from "@/components/FormInput";
import ListProduct from "@/components/ListProduct";
import ListProductDesktop from "@/components/ListProductDesktop";
import db from "@/lib/db";

interface ProductSearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function ProductSearchPage({
  searchParams,
}: ProductSearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim();

  const products = query
    ? await db.product.findMany({
        where: {
          OR: [
            {
              title: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              description: {
                contains: query,
                mode: "insensitive",
              },
            },
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
          status: true,
          type: true,
        },
      })
    : [];

  return (
    <div className="container-lg p-5 flex flex-col gap-3 mb-20">
      <form className="mb-4 lg:hidden">
        <FormInput
          type="text"
          name="q"
          defaultValue={query}
          placeholder="Search products..."
        />
      </form>

      {products.length === 0 ? (
        <p className="text-white">No products found.</p>
      ) : (
        <>
          <div className="flex flex-col gap-3 lg:hidden">
            {products.map((product) => (
              <ListProduct key={product.id} {...product} />
            ))}
          </div>

          <div className="hidden lg:grid lg:grid-cols-5 gap-6">
            {products.map((product) => (
              <ListProductDesktop key={product.id} {...product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
