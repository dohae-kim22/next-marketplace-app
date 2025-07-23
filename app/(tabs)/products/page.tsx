import ListProduct from "@/components/ListProduct";
import db from "@/lib/db";

async function getProducts() {
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      id: true,
      photo: true,
      created_at: true,
      views: true,
      productLikes: true,
      location: true,
    },
  });

  return products;
}

export default async function Products() {
  const products = await getProducts();
  return (
    <div className="p-5 flex flex-col gap-3">
      {products.map((product) => (
        <ListProduct key={product.id} {...product} />
      ))}
    </div>
  );
}
