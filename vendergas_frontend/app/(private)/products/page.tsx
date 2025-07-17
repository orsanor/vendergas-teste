// app/products/page.tsx
"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table"; 

export const columns = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "price",
    header: "Preço",
    cell: ({ row }) => `R$ ${row.getValue("price")}`,
  },
  {
    accessorKey: "description",
    header: "Descrição",
  },
];

export default function ProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/products") // ajuste para sua API real
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Produtos</h1>
      <DataTable columns={columns} data={products} />
    </div>
  );
}
