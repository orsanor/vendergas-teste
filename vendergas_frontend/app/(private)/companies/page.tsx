"use client";

import { useSession } from "@/lib/auth-client";
import { FormEvent, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Loader2, Pencil, Trash2, Save, X } from "lucide-react";
import type { Company } from "@/types/company";
import { z } from "zod";
import { useCompanies } from "@/hooks/use-companies";

const companySchema = z.object({
  tradeName: z.string().min(1, "Nome Fantasia obrigatório"),
  legalName: z.string().min(1, "Razão Social obrigatória"),
  cnpj: z.string().regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, "CNPJ inválido"),
});

function maskCnpj(value: string) {
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
}

export default function CompaniesPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const { data: session } = useSession();
  const user = session?.user;
  const { companies, loading } = useCompanies(user?.id);

  const [tradeName, setTradeName] = useState("");
  const [legalName, setLegalName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTradeName, setEditTradeName] = useState("");
  const [editLegalName, setEditLegalName] = useState("");
  const [editCnpj, setEditCnpj] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = companySchema.safeParse({ tradeName, legalName, cnpj });
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }
    setError(null);
    setSaving(true);
    try {
      const res = await fetch(`${baseUrl}/api/v1/companies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tradeName,
          legalName,
          cnpj,
          userId: user?.id,
        }),
        credentials: "include",
      });
      if (res.ok) {
        toast.success("Empresa cadastrada!");
        setTradeName("");
        setLegalName("");
        setCnpj("");
        window.dispatchEvent(new Event("companyListChanged"));
      } else {
        toast.error("Erro ao cadastrar empresa");
      }
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (company: Company) => {
    setEditingId(company.id);
    setEditTradeName(company.tradeName);
    setEditLegalName(company.legalName);
    setEditCnpj(company.cnpj);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTradeName("");
    setEditLegalName("");
    setEditCnpj("");
  };

  const handleEdit = async (id: string) => {
    setEditSaving(true);
    try {
      const res = await fetch(`${baseUrl}/api/v1/companies/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tradeName: editTradeName,
          legalName: editLegalName,
          cnpj: editCnpj,
        }),
        credentials: "include",
      });
      if (res.ok) {
        toast.success("Empresa atualizada!");
        window.dispatchEvent(new Event("companyListChanged"));
        cancelEdit();
      } else {
        toast.error("Erro ao atualizar empresa");
      }
    } finally {
      setEditSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta empresa?")) return;
    try {
      const res = await fetch(`${baseUrl}/api/v1/companies/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        toast.success("Empresa excluída!");
        window.dispatchEvent(new Event("companyListChanged"));
      } else {
        toast.error("Erro ao excluir empresa");
      }
    } catch {
      toast.error("Erro ao excluir empresa");
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Cadastrar Empresa</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="tradeName">Nome Fantasia</Label>
              <Input
                id="tradeName"
                value={tradeName}
                onChange={(e) => setTradeName(e.target.value)}
                required
                placeholder="Nome Fantasia"
              />
            </div>
            <div>
              <Label htmlFor="legalName">Razão Social</Label>
              <Input
                id="legalName"
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
                required
                placeholder="Razão Social"
              />
            </div>
            <div>
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input
                id="cnpj"
                value={cnpj}
                onChange={(e) => setCnpj(maskCnpj(e.target.value))}
                required
                placeholder="CNPJ"
                maxLength={18}
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
        </CardContent>
      </Card>

      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Minhas Empresas</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="animate-spin" />
            </div>
          ) : companies.length === 0 ? (
            <div className="text-muted-foreground text-center">
              Nenhuma empresa cadastrada.
            </div>
          ) : (
            <div className="space-y-2">
              {companies.map((company) =>
                editingId === company.id ? (
                  <form
                    key={company.id}
                    className="rounded-lg border p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2 bg-muted/30"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const result = companySchema.safeParse({
                        tradeName: editTradeName,
                        legalName: editLegalName,
                        cnpj: editCnpj,
                      });
                      if (!result.success) {
                        setError(result.error.errors[0].message);
                        return;
                      }
                      setError(null);
                      handleEdit(company.id);
                    }}
                  >
                    <div className="flex-1 space-y-1">
                      <Label>Nome Fantasia</Label>
                      <Input
                        value={editTradeName}
                        onChange={(e) => setEditTradeName(e.target.value)}
                        required
                        placeholder="Nome Fantasia"
                        className="mb-1"
                      />
                      <Label>Razão social</Label>
                      <Input
                        value={editLegalName}
                        onChange={(e) => setEditLegalName(e.target.value)}
                        required
                        placeholder="Razão Social"
                        className="mb-1"
                      />
                      <Label>Cnpj</Label>
                      <Input
                        value={editCnpj}
                        onChange={(e) => setEditCnpj(maskCnpj(e.target.value))}
                        required
                        placeholder="CNPJ"
                        className="mb-1"
                        maxLength={18}
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
                  </form>
                ) : (
                  <div
                    key={company.id}
                    className="rounded-lg border p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                  >
                    <div>
                      <div className="font-medium">{company.tradeName}</div>
                      <div className="text-sm text-muted-foreground">
                        {company.legalName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        CNPJ: {company.cnpj}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => startEdit(company)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDelete(company.id)}
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
