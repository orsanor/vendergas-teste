"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save, X, Loader2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { z } from "zod";
import type { Client } from "@/types/client";

const clientSchema = z.object({
  name: z.string().min(1, "Nome obrigatório"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(14, "Telefone inválido"),
  companyId: z.string().min(1, "Empresa obrigatória"),
});

function maskPhone(value: string) {
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/g, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{4})\d+?$/, "$1");
}

export function ClientEditForm({
  client,
  onSave,
  onCancel,
  loading,
  companies,
}: {
  client: Client;
  onSave: (data: Client) => void;
  onCancel: () => void;
  loading: boolean;
  companies: { id: string; tradeName: string }[];
}) {
  const [name, setName] = useState(client.name);
  const [email, setEmail] = useState(client.email);
  const [phone, setPhone] = useState(client.phone);
  const [companyId, setCompanyId] = useState(client.companyId);
  const [error, setError] = useState<string | null>(null);

  const hasCompanies = companies.length > 0;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const result = clientSchema.safeParse({
      name,
      email,
      phone,
      companyId,
    });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    setError(null);
    onSave({ id: client.id, name, email, phone, companyId });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 bg-muted/30 rounded-lg border p-4"
    >
      <div className="flex-1 space-y-1">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Nome"
          className="mb-1"
        />
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Email"
          className="mb-1"
        />
        <Input
          value={phone}
          onChange={(e) => setPhone(maskPhone(e.target.value))}
          required
          placeholder="Telefone"
          className="mb-1"
          maxLength={15}
        />
        <select
          value={companyId}
          onChange={(e) => setCompanyId(e.target.value)}
          className="w-full border rounded-md px-3 py-2 mt-1"
          required
          disabled={!hasCompanies}
        >
          <option value="" disabled>
            Selecione a empresa
          </option>
          {hasCompanies ? (
            companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.tradeName}
              </option>
            ))
          ) : null}
        </select>
        {!hasCompanies && (
          <div className="text-red-500 text-sm mt-1">Você precisa cadastrar uma empresa primeiro.</div>
        )}
      </div>
      <div className="flex gap-2 mt-2 md:mt-0">
        <Button type="submit" size="icon" disabled={loading || !hasCompanies}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
        </Button>
        <Button
          type="button"
          size="icon"
          variant="secondary"
          onClick={onCancel}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      {error && <div className="text-red-500 text-sm w-full">{error}</div>}
    </form>
  );
}
