import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import ListProduct from "@/components/ListProduct";
import db from "@/lib/db";

interface Props {
  searchParams: {
    q?: string;
  };
}

export default async function ProductSearchPage({ searchParams }: Props) {
  const query = searchParams.q?.trim();

  const products = query
    ? await db.product.findMany({
        where: {
          OR: [
            {
              title: {
                contains: query,
              },
            },
            {
              description: {
                contains: query,
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
    <div className="p-5 space-y-4">
      <form className="mb-4">
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
        <div className="flex flex-col gap-3">
          {products.map((product) => (
            <ListProduct key={product.id} {...product} />
          ))}
        </div>
      )}
    </div>
  );
}
