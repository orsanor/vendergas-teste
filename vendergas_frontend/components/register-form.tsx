"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const registerSchema = z
  .object({
    name: z.string().min(1, "O nome é obrigatório"),
    email: z.string().email("Email inválido"),
    password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "As senhas não coincidem.",
    path: ["confirm"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFieldErrors({});

    console.log("Enviando:", { name, email, password });

    const { error } = await authClient.signUp.email({
      name: name,
      email: email,
      password: password,
    });

    if (error) {
      setFormError(error.message || "Erro ao criar conta.");
      return;
    }

    router.push("/");
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <form
        onSubmit={handleSignup}
        className="min-w-sm border-muted bg-background flex w-full max-w-sm flex-col items-center gap-y-4 rounded-md border px-6 py-8 shadow-md"
      >
        <h1 className="text-xl font-semibold">Registre-se</h1>

        <div className="flex w-full flex-col gap-2">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome"
            className="text-sm"
            required
          />
          {fieldErrors.name && (
            <p className="text-sm text-red-500">{fieldErrors.name}</p>
          )}
        </div>

        <div className="flex w-full flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="text-sm"
            required
          />
          {fieldErrors.email && (
            <p className="text-sm text-red-500">{fieldErrors.email}</p>
          )}
        </div>

        <div className="flex w-full flex-col gap-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            className="text-sm"
            required
          />
          <span className="text-xs text-muted-foreground">A senha deve conter no mínimo 8 dígitos.</span>
          {fieldErrors.password && (
            <p className="text-sm text-red-500">{fieldErrors.password}</p>
          )}
        </div>

        <div className="flex w-full flex-col gap-2">
          <Label htmlFor="confirm">Confirmar Senha</Label>
          <Input
            id="confirm"
            type={showPassword ? "text" : "password"}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirmar Senha"
            className="text-sm"
            required
          />
          {fieldErrors.confirm && (
            <p className="text-sm text-red-500">{fieldErrors.confirm}</p>
          )}
        </div>

        {formError && (
          <p className="text-red-500 text-sm w-full text-left">{formError}</p>
        )}

        <Button type="submit" className="w-full">
          Criar conta
        </Button>
      </form>

      <div className="text-muted-foreground flex justify-center gap-1 text-sm">
        <p>Já possui conta?</p>
        <a href={`/`} className="text-primary font-medium hover:underline">
          Login
        </a>
      </div>
    </div>
  );
}
