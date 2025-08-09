export interface ListProductProps {
  id: number;
  title: string;
  price: number;
  photo: string;
  created_at: Date;
  views: number;
  location: string;
  status: "ON_SALE" | "SOLD";
  type: "SALE" | "FREE" | "WANTED";
  latitude: number;
  longitude: number;
  street: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  countryCode: string | null;
  productLikes: { id: number; userId: number; productId: number }[];
}

export type ProductLikeDTO = {
  id: number;
  userId: number;
  productId: number;
};

export type RawRow = Omit<ListProductProps, "productLikes"> & {
  productLikes: any;
};
