"use client";

import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Loader2, Trash2, Save } from "lucide-react";

export default function UserProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const user = session?.user;
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!user) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const { error } = await authClient.updateUser({ name });
      if (!error) {
        toast.success("Dados atualizados com sucesso!");
      } else {
        toast.error(error.message || "Erro ao atualizar dados.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita."
      )
    )
      return;
    setIsDeleting(true);
    try {
      const { error } = await authClient.deleteUser();
      if (!error) {
        toast.success("Conta excluída com sucesso!");
        await authClient.signOut();
        router.replace("/");
      } else {
        toast.error(error.message || "Erro ao excluir conta.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[90vh] bg-muted/40">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader>
          <CardTitle>Minha Conta</CardTitle>
          <CardDescription>
            Gerencie suas informações pessoais, não é possivel alterar o email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                placeholder="Seu nome"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                readOnly
                disabled
                onChange={(e) => setEmail(e.target.value)}
                className="opacity-80 cursor-not-allowed"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="flex-1"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Excluindo...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir conta
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
