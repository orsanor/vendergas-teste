"use client";

import * as React from "react";
import { ChevronsUpDown, Plus, Building } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import type { Company } from "@/types/company";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function CompanySwitcher({ company }: { company: Company[] }) {
  const router = useRouter();
  const { isMobile } = useSidebar();
  const [activeCompany, setActiveCompany] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("activeCompanyId");
      return company.find((t) => t.id === saved) || company[0];
    }
    return company[0];
  });

  useEffect(() => {
    if (activeCompany) {
      localStorage.setItem("activeCompanyId", activeCompany.id);
    }
  }, [activeCompany]);

  useEffect(() => {
    const handler = () => {
      window.location.reload(); 
    };
    window.addEventListener("companyListChanged", handler);
    return () => window.removeEventListener("companyListChanged", handler);
  }, []);

  if (!company || company.length === 0) return null;

  const handleCompany = () => {
    router.push("/companies");
  };

  const handleSelectCompany = (company: Company) => {
    setActiveCompany(company);
    localStorage.setItem("activeCompanyId", company.id);
    window.dispatchEvent(new Event("companyChanged"));
  };

  if (!activeCompany) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Building className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {activeCompany.tradeName}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Empresas
            </DropdownMenuLabel>
            {company.map((company) => (
              <DropdownMenuItem
                key={company.id}
                onClick={() => handleSelectCompany(company)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <Building className="size-3.5 shrink-0" />
                </div>
                {company.tradeName}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2" onClick={handleCompany}>
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">
                Adicionar empresa
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
