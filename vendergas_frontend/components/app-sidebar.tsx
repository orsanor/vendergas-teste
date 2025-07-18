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
import { useCompanies } from "@/hooks/use-companies";
import { Building } from "lucide-react";
import { ComponentProps } from "react";

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  const user = session?.user;
  const { companies, loading } = useCompanies(user?.id);

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
