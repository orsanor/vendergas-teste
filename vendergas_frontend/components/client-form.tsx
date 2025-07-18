"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
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

export function ClientForm({
  onSubmit,
  companies,
  loading,
}: {
  onSubmit: (data: Omit<Client, "id">) => void;
  companies: { id: string; tradeName: string }[];
  loading: boolean;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [companyId, setCompanyId] = useState(companies[0]?.id || "");
  const [error, setError] = useState<string | null>(null);

  const hasCompanies = companies.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = clientSchema.safeParse({ name, email, phone, companyId });
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }
    setError(null);
    onSubmit({ name, email, phone, companyId });
    setName("");
    setEmail("");
    setPhone("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="company">Empresa</Label>
        <select
          id="company"
          value={companyId}
          onChange={(e) => setCompanyId(e.target.value)}
          className="w-full border rounded-md px-3 py-2"
          required
          disabled={!hasCompanies}
        >
          {hasCompanies ? (
            companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.tradeName}
              </option>
            ))
          ) : (
            <option value="">Nenhuma empresa disponível</option>
          )}
        </select>
        {!hasCompanies && (
          <div className="text-red-500 text-sm mt-1">Você precisa cadastrar uma empresa primeiro.</div>
        )}
      </div>
      <div>
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Nome do cliente"
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Email do cliente"
        />
      </div>
      <div>
        <Label htmlFor="phone">Telefone</Label>
        <Input
          id="phone"
          value={phone}
          onChange={(e) => setPhone(maskPhone(e.target.value))}
          required
          placeholder="Telefone do cliente"
          maxLength={15}
        />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Button type="submit" className="w-full" disabled={loading || !hasCompanies}>
        {loading ? (
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
  );
}
