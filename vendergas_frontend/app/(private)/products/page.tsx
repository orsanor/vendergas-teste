"use client";

import { FormEvent, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Loader2, Pencil, Trash2, Save, X } from "lucide-react";
import { z } from "zod";
import type { Product } from "@/types/product";
import { useCompanies } from "@/hooks/use-companies";
import { useSession } from "@/lib/auth-client";

const productSchema = z.object({
  name: z.string().min(1, "Nome obrigatório"),
  price: z.string().regex(/^\d+([.,]\d{2})?$/, "Preço inválido"),
  description: z.string().min(1, "Descrição obrigatória"),
  companyId: z.string().min(1, "Empresa obrigatória"),
});

function maskPrice(value: string) {
  value = value.replace(/\D/g, "");
  value = (Number(value) / 100).toFixed(2) + "";
  value = value.replace(".", ",");
  return value;
}

export default function ProductsPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const user = session?.user;
  const { companies, loading: companiesLoading } = useCompanies(user?.id);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCompanyId, setEditCompanyId] = useState<string | null>(null);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);

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
    setLoading(true);
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
      })
      .finally(() => setLoading(false));
  }, [companyId, baseUrl]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = productSchema.safeParse({
      name,
      price,
      description,
      companyId: companyId,
    });
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }
    setError(null);
    setSaving(true);
    try {
      const res = await fetch(`${baseUrl}/api/v1/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          price: Number(price.replace(",", ".")),
          description,
          companyId: companyId,
        }),
        credentials: "include",
      });
      if (res.ok) {
        toast.success("Produto cadastrado!");
        setName("");
        setPrice("");
        setDescription("");
        const novo = await res.json();
        setProducts((prev) => [...prev, novo]);
      } else {
        toast.error("Erro ao cadastrar produto");
      }
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setEditName(product.name);
    setEditPrice(product.price.toFixed(2).replace(".", ","));
    setEditDescription(product.description);
    setEditCompanyId(product.companyId);
    setEditError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditPrice("");
    setEditDescription("");
    setEditCompanyId(null);
    setEditError(null);
  };

  const handleEdit = async (id: string) => {
    const result = productSchema.safeParse({
      name: editName,
      price: editPrice,
      description: editDescription,
      companyId: editCompanyId,
    });
    if (!result.success) {
      setEditError(result.error.errors[0].message);
      return;
    }
    setEditError(null);
    setEditSaving(true);
    try {
      const res = await fetch(`${baseUrl}/api/v1/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          price: Number(editPrice.replace(",", ".")),
          description: editDescription,
          companyId: editCompanyId,
        }),
        credentials: "include",
      });
      if (res.ok) {
        toast.success("Produto atualizado!");
        setProducts((prev) =>
          prev.map((p) =>
            p.id === id
              ? {
                  ...p,
                  name: editName,
                  price: Number(editPrice.replace(",", ".")),
                  description: editDescription,
                  companyId: editCompanyId!,
                }
              : p
          )
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
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;
    try {
      const res = await fetch(`${baseUrl}/api/v1/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        toast.success("Produto excluído!");
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        toast.error("Erro ao excluir produto");
      }
    } catch {
      toast.error("Erro ao excluir produto");
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Cadastrar Produto</CardTitle>
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
                onClick={() => window.location.href = "/companies"}
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
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome do produto"
                  required
                />
              </div>
              <div>
                <Label htmlFor="price">Preço</Label>
                <Input
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(maskPrice(e.target.value))}
                  placeholder="0,00"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descrição do produto"
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
                    Cadastrar
                  </>
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Produtos da Empresa</CardTitle>
        </CardHeader>
        <CardContent>
          {companiesLoading ? (
            <div className="text-center py-8">
              <Loader2 className="animate-spin mb-4" />
              <p className="text-muted-foreground">Carregando produtos...</p>
            </div>
          ) : companies.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Você precisa cadastrar uma empresa primeiro.
              </p>
            </div>
          ) : loading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="animate-spin" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-muted-foreground text-center">
              Nenhum produto cadastrado.
            </div>
          ) : (
            <div className="space-y-2">
              {products.map((product) =>
                editingId === product.id ? (
                  <form
                    key={product.id}
                    className="rounded-lg border p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2 bg-muted/30"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleEdit(product.id);
                    }}
                  >
                    <div className="flex-1 space-y-1">
                      <Label>Nome</Label>
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        required
                        placeholder="Nome"
                        className="mb-1"
                      />
                      <Label>Preço</Label>
                      <Input
                        value={editPrice}
                        onChange={(e) =>
                          setEditPrice(maskPrice(e.target.value))
                        }
                        required
                        placeholder="Preço"
                        className="mb-1"
                        maxLength={10}
                      />
                      <Label>Descrição</Label>
                      <Input
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        required
                        placeholder="Descrição"
                        className="mb-1"
                      />
                      <Label>Empresa</Label>
                      <select
                        value={editCompanyId ?? ""}
                        onChange={(e) => setEditCompanyId(e.target.value)}
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
                    key={product.id}
                    className="rounded-lg border p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                  >
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {product.description}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Preço: R$ {product.price.toFixed(2).replace(".", ",")}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => startEdit(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDelete(product.id)}
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
