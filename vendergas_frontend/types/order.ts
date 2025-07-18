import type { Product } from "@/types/product";

export type Order = {
  id: string;
  number: string;
  notes?: string;
  date: string;
  clientId: string;
  companyId: string;
  client?: { id: string; name: string };
  orderProducts?: { productId: string; quantity: number; product?: Product }[];
};
