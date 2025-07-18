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
import { useCompanies } from "@/hooks/use-companies";
import { useSession } from "@/lib/auth-client";

const orderSchema = z.object({
  notes: z.string().optional(),
  clientId: z.string().min(1, "Cliente obrigatório"),
  companyId: z.string().min(1, "Empresa obrigatória"),
});

const editOrderSchema = z.object({
  notes: z.string().optional(),
  clientId: z.string().min(1, "Cliente obrigatório"),
});

export default function OrderPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const user = session?.user;
  const { companies, loading: companiesLoading } = useCompanies(user?.id);
  const [clients, setClients] = useState<{ id: string; name: string }[]>([]);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNumber, setEditNumber] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editClientId, setEditClientId] = useState<string | null>(null);
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
    fetch(`${baseUrl}/api/v1/clients?companyId=${companyId}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setClients(data));
  }, [companyId, baseUrl]);

  useEffect(() => {
    if (!companyId) return;
    setLoading(true);
    fetch(`${baseUrl}/api/v1/orders?companyId=${companyId}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch(() => toast.error("Erro ao buscar pedidos"))
      .finally(() => setLoading(false));
  }, [companyId, baseUrl]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = orderSchema.safeParse({
      notes,
      clientId: clientId ?? "",
      companyId: companyId ?? "",
    });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    setError(null);
    setSaving(true);
    try {
      const res = await fetch(`${baseUrl}/api/v1/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notes,
          clientId,
          companyId,
        }),
        credentials: "include",
      });
      if (res.ok) {
        toast.success("Pedido cadastrado!");
        setNotes("");
        setClientId(null);
        const novo = await res.json();
        setOrders((prev) => [
          ...prev,
          {
            ...novo,
            clientId: novo.clientId ?? "",
            companyId: novo.companyId ?? "",
          } as Order,
        ]);
      } else {
        toast.error("Erro ao cadastrar pedido");
      }
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (order: Order) => {
    setEditingId(order.id);
    setEditNumber(order.number);
    setEditNotes(order.notes || "");
    setEditClientId(order.clientId);
    setEditError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditNumber("");
    setEditNotes("");
    setEditClientId(null);
    setEditError(null);
  };

  const handleEdit = async (id: string) => {
    const result = editOrderSchema.safeParse({
      notes: editNotes,
      clientId: editClientId,
    });
    if (!result.success) {
      setEditError(result.error.issues[0].message);
      return;
    }
    setEditError(null);
    setEditSaving(true);
    try {
      const res = await fetch(`${baseUrl}/api/v1/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notes: editNotes,
          clientId: editClientId,
        }),
        credentials: "include",
      });
      if (res.ok) {
        toast.success("Pedido atualizado!");
        const updatedOrder = await res.json();
        setOrders((prev) =>
          prev.map((o) =>
            o.id === id
              ? {
                  ...o,
                  notes: editNotes,
                  clientId: editClientId || "",
                  client:
                    clients.find((c) => c.id === editClientId) || o.client,
                }
              : o
          )
        );
        cancelEdit();
      } else {
        toast.error("Erro ao atualizar pedido");
      }
    } finally {
      setEditSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este pedido?")) return;
    try {
      const res = await fetch(`${baseUrl}/api/v1/orders/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        toast.success("Pedido excluído!");
        setOrders((prev) => prev.filter((o) => o.id !== id));
      } else {
        toast.error("Erro ao excluir pedido");
      }
    } catch {
      toast.error("Erro ao excluir pedido");
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Cadastrar Pedido</CardTitle>
        </CardHeader>
        <CardContent>
          {companiesLoading ? (
            <div className="text-center py-8">
              <Loader2 className="animate-spin mb-4" />
              <p className="text-muted-foreground">Carregando empresas...</p>
            </div>
          ) : companies.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Você precisa cadastrar uma empresa primeiro.
              </p>
              <Button
                onClick={() => (window.location.href = "/companies")}
                className="w-full"
              >
                Cadastrar Empresa
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="company">Empresa</Label>
                <select
                  id="company"
                  value={companyId ?? ""}
                  onChange={(e) => {
                    setCompanyId(e.target.value);
                    localStorage.setItem("activeCompanyId", e.target.value);
                    window.dispatchEvent(new Event("companyChanged"));
                  }}
                  className="w-full border rounded-md px-3 py-2"
                  required
                >
                  <option value="" disabled>
                    Selecione a empresa
                  </option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.tradeName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="client">Cliente</Label>
                <select
                  id="client"
                  value={clientId ?? ""}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full border rounded-md px-3 py-2"
                  required
                >
                  <option value="" disabled>
                    Selecione o cliente
                  </option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="notes">Observação</Label>
                <Input
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Observação (opcional)"
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
                    Cadastrar
                  </>
                )}
              </Button>
            </form>
          )}
          {orders.length > 0 && (
            <div className="mt-4">
              <Button
                className="w-full"
                variant="outline"
                onClick={() => (window.location.href = "/orderProducts")}
              >
                Gerenciar produtos dos pedidos
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Pedidos da Empresa</CardTitle>
        </CardHeader>
        <CardContent>
          {companiesLoading ? (
            <div className="text-center py-8">
              <Loader2 className="animate-spin mb-4" />
              <p className="text-muted-foreground">Carregando pedidos...</p>
            </div>
          ) : companies.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Você precisa cadastrar uma empresa primeiro.
              </p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-muted-foreground text-center">
              Nenhum pedido cadastrado.
            </div>
          ) : (
            <div className="space-y-2">
              {orders.map((order) =>
                editingId === order.id ? (
                  <form
                    key={order.id}
                    className="rounded-lg border p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2 bg-muted/30"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleEdit(order.id);
                    }}
                  >
                    <div className="flex-1 space-y-1">
                      <Label>Número</Label>
                      <Input
                        value={editNumber}
                        disabled
                        placeholder="Número"
                        className="mb-1 bg-muted"
                      />
                      <Label>Cliente</Label>
                      <select
                        value={editClientId ?? ""}
                        onChange={(e) => setEditClientId(e.target.value)}
                        className="w-full border rounded-md px-3 py-2"
                        required
                      >
                        <option value="" disabled>
                          Selecione o cliente
                        </option>
                        {clients.map((client) => (
                          <option key={client.id} value={client.id}>
                            {client.name}
                          </option>
                        ))}
                      </select>
                      <Label>Observação</Label>
                      <Input
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        placeholder="Observação"
                        className="mb-1"
                      />
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
                    key={order.id}
                    className="rounded-lg border p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                  >
                    <div>
                      <div className="font-medium">{order.number}</div>
                      <div className="text-sm text-muted-foreground">
                        Cliente: {order.client?.name || "-"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Data:{" "}
                        {order.date
                          ? new Date(order.date).toLocaleDateString("pt-BR")
                          : "-"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Observação: {order.notes || "-"}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => startEdit(order)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDelete(order.id)}
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
