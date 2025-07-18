"use client";

import { FormEvent, useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Pencil, Trash2, Save, X, Plus } from "lucide-react";
import { z } from "zod";
import type { Order } from "@/types/order";
import type { OrderProduct } from "@/types/orderProduct";
import type { Product } from "@/types/product";
import { useCompanies } from "@/hooks/use-companies";
import { useSession } from "@/lib/auth-client";

const orderProductSchema = z.object({
  orderId: z.string().min(1, "Pedido obrigatório"),
  productId: z.string().min(1, "Produto obrigatório"),
  quantity: z.number().min(1, "Quantidade deve ser maior que 0"),
});

export default function OrderProductsPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [orderProducts, setOrderProducts] = useState<OrderProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const { data: session } = useSession();
  const user = session?.user;
  const { companies, loading: companiesLoading } = useCompanies(user?.id);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [productId, setProductId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState(1);
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("activeCompanyId");
    setCompanyId(id);
  }, []);

  useEffect(() => {
    const updateCompany = () => {
      const id = localStorage.getItem("activeCompanyId");
      setCompanyId(id);
    };
    window.addEventListener("storage", updateCompany);
    window.addEventListener("companyChanged", updateCompany);
    return () => {
      window.removeEventListener("storage", updateCompany);
      window.removeEventListener("companyChanged", updateCompany);
    };
  }, []);

  useEffect(() => {
    if (!companyId) return;
    fetch(`${baseUrl}/api/v1/orders?companyId=${companyId}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        const ordersArray = Array.isArray(data) ? data : [];
        setOrders(ordersArray);
      })
      .catch(() => {
        setOrders([]);
        toast.error("Erro ao buscar pedidos");
      });
  }, [companyId, baseUrl]);

  useEffect(() => {
    if (!companyId) return;
    fetch(`${baseUrl}/api/v1/products/company/${companyId}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        const productsArray = Array.isArray(data) ? data : [];
        setProducts(productsArray);
      })
      .catch(() => {
        setProducts([]);
        toast.error("Erro ao buscar produtos");
      });
  }, [companyId, baseUrl]);

  useEffect(() => {
    if (!companyId) return;
    setLoading(true);
    const url = orderId
      ? `${baseUrl}/api/v1/order-products?orderId=${orderId}&companyId=${companyId}`
      : `${baseUrl}/api/v1/order-products?companyId=${companyId}`;

    fetch(url, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        const orderProductsArray = Array.isArray(data) ? data : [];
        setOrderProducts(orderProductsArray);
      })
      .catch(() => {
        setOrderProducts([]);
        toast.error("Erro ao buscar produtos dos pedidos");
      })
      .finally(() => setLoading(false));
  }, [companyId, orderId, baseUrl]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = orderProductSchema.safeParse({
      orderId: orderId ?? "",
      productId: productId ?? "",
      quantity,
    });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    setError(null);
    setSaving(true);
    try {
      const res = await fetch(`${baseUrl}/api/v1/order-products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          productId,
          quantity,
        }),
        credentials: "include",
      });
      if (res.ok) {
        toast.success("Produto adicionado ao pedido!");
        setOrderId(null);
        setProductId(null);
        setQuantity(1);
        const novo = await res.json();
        setOrderProducts((prev) => [...prev, novo]);
      } else {
        toast.error("Erro ao adicionar produto ao pedido");
      }
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (orderProduct: OrderProduct) => {
    setEditingId(orderProduct.id);
    setEditQuantity(orderProduct.quantity);
    setEditProductId(orderProduct.productId);
    setEditError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditQuantity(1);
    setEditProductId(null);
    setEditError(null);
  };

  const handleEdit = async (id: string) => {
    if (editQuantity < 1) {
      setEditError("Quantidade deve ser maior que 0");
      return;
    }
    if (!editProductId) {
      setEditError("Produto obrigatório");
      return;
    }
    setEditError(null);
    setEditSaving(true);
    try {
      const res = await fetch(`${baseUrl}/api/v1/order-products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quantity: editQuantity,
          productId: editProductId,
        }),
        credentials: "include",
      });
      if (res.ok) {
        toast.success("Produto atualizado!");
        const updated = await res.json();
        setOrderProducts((prev) =>
          prev.map((op) => (op.id === id ? updated : op))
        );
        cancelEdit();
      } else {
        toast.error("Erro ao atualizar produto");
      }
    } finally {
      setEditSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover este produto do pedido?"))
      return;
    try {
      const res = await fetch(`${baseUrl}/api/v1/order-products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        toast.success("Produto removido do pedido!");
        setOrderProducts((prev) => prev.filter((op) => op.id !== id));
      } else {
        toast.error("Erro ao remover produto do pedido");
      }
    } catch {
      toast.error("Erro ao remover produto do pedido");
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Adicionar Produto ao Pedido</CardTitle>
        </CardHeader>
        <CardContent>
          {companiesLoading || companies.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Você precisa cadastrar uma empresa primeiro.
              </p>
              <Button
                onClick={() => window.location.href = "/companies"}
                className="w-full"
              >
                Cadastrar Empresa
              </Button>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Você precisa cadastrar um pedido primeiro.
              </p>
              <Button
                onClick={() => window.location.href = "/order"}
                className="w-full"
              >
                Cadastrar Pedido
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="order">Pedido</Label>
                <select
                  id="order"
                  value={orderId ?? ""}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full border rounded-md px-3 py-2"
                  required
                >
                  <option value="" disabled>
                    Selecione o pedido
                  </option>
                  {orders.map((order) => (
                    <option key={order.id} value={order.id}>
                      #{order.number} -{" "}
                      {order.client?.name || "Cliente não informado"}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="product">Produto</Label>
                <select
                  id="product"
                  value={productId ?? ""}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full border rounded-md px-3 py-2"
                  required
                >
                  <option value="" disabled>
                    Selecione o produto
                  </option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} (R$ {product.price.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="quantity">Quantidade</Label>
                <Input
                  id="quantity"
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full"
                  required
                />
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <Button type="submit" className="w-full" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar
                  </>
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Produtos dos Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label htmlFor="filter-order">Filtrar por Pedido</Label>
            <select
              id="filter-order"
              value={orderId ?? ""}
              onChange={(e) => setOrderId(e.target.value || null)}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="">Todos os pedidos</option>
              {orders.map((order) => (
                <option key={order.id} value={order.id}>
                  #{order.number} -{" "}
                  {order.client?.name || "Cliente não informado"}
                </option>
              ))}
            </select>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="animate-spin" />
            </div>
          ) : orderProducts.length === 0 ? (
            <div className="text-muted-foreground text-center">
              Nenhum produto encontrado nos pedidos.
            </div>
          ) : (
            <div className="space-y-2">
              {orderProducts.map((orderProduct) =>
                editingId === orderProduct.id ? (
                  <form
                    key={orderProduct.id}
                    className="rounded-lg border p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2 bg-muted/30"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleEdit(orderProduct.id);
                    }}
                  >
                    <div className="flex-1 space-y-1">
                      <div className="text-sm font-medium">
                        Pedido: #{orderProduct.order?.number} -{" "}
                        {orderProduct.order?.client?.name}
                      </div>
                      <div className="text-sm">
                        <Label className="text-xs">Produto:</Label>
                        <select
                          value={editProductId ?? ""}
                          onChange={(e) => setEditProductId(e.target.value)}
                          className="w-full border rounded-md px-2 py-1 text-sm"
                          required
                        >
                          <option value="" disabled>
                            Selecione o produto
                          </option>
                          {products.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.name} (R$ {product.price.toFixed(2)})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-xs">Quantidade:</Label>
                        <Input
                          type="number"
                          min={1}
                          value={editQuantity}
                          onChange={(e) =>
                            setEditQuantity(Number(e.target.value))
                          }
                          className="w-20"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2 md:mt-0">
                      <Button type="submit" size="icon" disabled={editSaving}>
                        {editSaving ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="secondary"
                        onClick={cancelEdit}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {editError && (
                      <div className="text-red-500 text-sm w-full">
                        {editError}
                      </div>
                    )}
                  </form>
                ) : (
                  <div
                    key={orderProduct.id}
                    className="rounded-lg border p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                  >
                    <div>
                      <div className="font-medium">
                        Pedido: #{orderProduct.order?.number} -{" "}
                        {orderProduct.order?.client?.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Produto: {orderProduct.product?.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Preço: R$ {orderProduct.product?.price.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Quantidade: {orderProduct.quantity}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total: R${" "}
                        {(
                          (orderProduct.product?.price || 0) *
                          orderProduct.quantity
                        ).toFixed(2)}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => startEdit(orderProduct)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDelete(orderProduct.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
