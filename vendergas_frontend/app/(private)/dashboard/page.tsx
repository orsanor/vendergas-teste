"use client";

import {
} from "@/components/ui/breadcrumb";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const features = [
  {
    title: "Clientes",
    description: "Cadastro e gerenciamento de clientes",
    href: "/clients",
  },
  {
    title: "Empresas",
    description: "Cadastro e gerenciamento de empresas",
    href: "/companies",
  },
  {
    title: "Produtos",
    description: "Cadastro e gerenciamento de produtos",
    href: "/products",
  },
  {
    title: "Lançar Pedido",
    description: "Cadastrar novo pedido",
    href: "/orders/new",
  },
  {
    title: "Gerenciar Pedidos",
    description: "Visualizar e gerenciar pedidos",
    href: "/orders",
  },
];

export default function DashboardPage() {
  return (
    <SidebarProvider>
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <Link key={feature.title} href={feature.href} className="group">
                <Card className="transition-all group-hover:scale-105 group-hover:shadow-lg cursor-pointer h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {feature.title}
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition" />
                    </CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
          {/* Espaço para conteúdo futuro, como gráficos ou resumos */}
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
