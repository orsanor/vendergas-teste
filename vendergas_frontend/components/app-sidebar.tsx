"use client";

import * as React from "react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { CompanySwitcher } from "@/components/company-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useSession } from "@/lib/auth-client";
import { useEffect } from "react";
import { Building } from "lucide-react";

export type Company = {
  id: string;
  name: string;
  logo: React.ElementType;
};

interface CompanyApiResponse {
  id: string;
  tradeName: string;
  cnpj: string;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const { data: session } = useSession();
  const user = session?.user;
  const [companies, setCompanies] = React.useState<Company[]>([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetch(`${baseUrl}/api/v1/companies?userId=${user.id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data: CompanyApiResponse[]) => {
        setCompanies(
          data.map((company) => ({
            id: company.id,
            name: company.tradeName,
            logo: () => (
              <span className="font-bold text-lg">
                <Building className="h-8 w-8 rounded-lg bg-muted p-1 text-muted-foreground" />
              </span>
            ),
          }))
        );
      })
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {!loading && companies.length > 0 ? (
          <CompanySwitcher company={companies} />
        ) : !loading && companies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <span className="mb-2">
              <Building className="h-10 w-10 text-muted-foreground" />
            </span>
            <span className="text-muted-foreground text-sm text-center">
              Você ainda não possui empresa cadastrada.
            </span>
          </div>
        ) : null}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={[]} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
