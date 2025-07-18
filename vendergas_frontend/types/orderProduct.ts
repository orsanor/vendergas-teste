export type OrderProduct = {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  order?: {
    id: string;
    number: string;
    client?: { name: string };
  };
  product?: {
    id: string;
    name: string;
    price: number;
  };
};
