"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { ClientForm } from "@/components/client-form";
import { ClientEditForm } from "@/components/client-edit";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Loader2 } from "lucide-react";
import type { Client } from "@/types/client";
import { useCompanies } from "@/hooks/use-companies";
import { useSession } from "@/lib/auth-client";

export default function ClientsPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  );
  const [companyId, setCompanyId] = useState<string | null>(null);
  const { data: session } = useSession();
  const user = session?.user;
  const { companies, loading: companiesLoading } = useCompanies(user?.id);

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
    fetch(`${baseUrl}/api/v1/clients?companyId=${companyId}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setClients(data))
      .catch(() => toast.error("Erro ao buscar clientes"))
      .finally(() => setLoading(false));
  }, [companyId, baseUrl]);

  useEffect(() => {
    if (companies.length > 0 && !selectedCompanyId) {
      setSelectedCompanyId(companies[0].id);
    }
  }, [companies, selectedCompanyId]);

  const handleCreate = async (data: Omit<Client, "id">) => {
    setSaving(true);
    try {
      const res = await fetch(`${baseUrl}/api/v1/clients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (res.ok) {
        toast.success("Cliente cadastrado!");
        const novo = await res.json();
        setClients((prev) => [...prev, novo]);
        window.dispatchEvent(new Event("companyListChanged"));
      } else {
        toast.error("Erro ao cadastrar cliente");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (data: Client) => {
    setEditSaving(true);
    try {
      const res = await fetch(`${baseUrl}/api/v1/clients/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          companyId: data.companyId,
        }),
        credentials: "include",
      });
      if (res.ok) {
        toast.success("Cliente atualizado!");
        setClients((prev) =>
          prev.map((c) =>
            c.id === data.id
              ? { ...c, name: data.name, email: data.email, phone: data.phone }
              : c
          )
        );
        setEditingId(null);
        window.dispatchEvent(new Event("companyListChanged")); 
      } else {
        toast.error("Erro ao atualizar cliente");
      }
    } finally {
      setEditSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este cliente?")) return;
    try {
      const res = await fetch(`${baseUrl}/api/v1/clients/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        toast.success("Cliente excluído!");
        setClients((prev) => prev.filter((c) => c.id !== id));
        window.dispatchEvent(new Event("companyListChanged"));
      } else {
        toast.error("Erro ao excluir cliente");
      }
    } catch {
      toast.error("Erro ao excluir cliente");
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {companiesLoading ? (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="animate-spin" />
        </div>
      ) : companies.length === 0 ? (
        <>
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Cadastrar Cliente</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Clientes da Empresa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Você precisa cadastrar uma empresa primeiro.
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Cadastrar Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              {companiesLoading ? (
                <div className="flex justify-center items-center h-32">
                  <Loader2 className="animate-spin" />
                </div>
              ) : (
                <ClientForm
                  onSubmit={handleCreate}
                  companies={companies.map((c) => ({ id: c.id, tradeName: c.tradeName }))}
                  loading={saving}
                />
              )}
            </CardContent>
          </Card>
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Clientes da Empresa</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <Loader2 className="animate-spin" />
                </div>
              ) : clients.length === 0 ? (
                <div className="text-muted-foreground text-center">
                  Nenhum cliente cadastrado.
                </div>
              ) : (
                <div className="space-y-2">
                  {clients.map((client) =>
                    editingId === client.id ? (
                      <ClientEditForm
                        key={client.id}
                        client={client}
                        onSave={handleEdit}
                        onCancel={() => setEditingId(null)}
                        loading={editSaving}
                        companies={companies}
                      />
                    ) : (
                      <div
                        key={client.id}
                        className="rounded-lg border p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                      >
                        <div>
                          <div className="font-medium">{client.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {client.email}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Telefone: {client.phone}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => setEditingId(client.id)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            onClick={() => handleDelete(client.id)}
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
        </>
      )}
    </div>
  );
}
