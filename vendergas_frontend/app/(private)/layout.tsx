"use client";
import { useSession } from "@/lib/auth-client";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function PrivateLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const pathname = usePathname();

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.replace("/");
    }
  }, [session, isPending, router]);

  const breadcrumbPage = getBreadcrumbPage(pathname);

  function getBreadcrumbPage(pathname: string) {
    if (pathname === "/dashboard") return "Início";
    if (pathname.startsWith("/clients")) return "Clientes";
    if (pathname.startsWith("/companies")) return "Empresas";
    if (pathname.startsWith("/products")) return "Produtos";
    if (pathname.startsWith("/orders")) return "Pedidos";
    if (pathname.startsWith("/user")) return "Minha Conta";
    return "Página";
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{breadcrumbPage}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
