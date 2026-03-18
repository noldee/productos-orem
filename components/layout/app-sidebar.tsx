"use client";

import * as React from "react";
import {
  IconDashboard,
  IconPackage,
  IconCategory,
  IconLeaf,
  IconBottle,
  IconFlame,
  IconSettings,
  IconHelp,
  IconArrowLeft,
  IconTag,
  IconPlant,
  IconRuler,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";

const navMain = [
  { title: "Dashboard", url: "/dashboard", icon: IconDashboard },
  { title: "Productos", url: "/dashboard/productos", icon: IconPackage },
  { title: "Categorías", url: "/dashboard/categorias", icon: IconTag },
  { title: "Líneas", url: "/dashboard/lineas", icon: IconPlant },
  { title: "Aromas", url: "/dashboard/aromas", icon: IconFlame },
  { title: "Formatos", url: "/dashboard/formatos", icon: IconRuler },
];

const navSecondary = [
  { title: "Configuración", url: "/dashboard/configuracion", icon: IconSettings },
  { title: "Ayuda", url: "#", icon: IconHelp },
  { title: "Volver al sitio", url: "/", icon: IconArrowLeft },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/">
                <span className="font-serif italic text-base font-semibold">
                  Productos<span className="text-terracota">.ORE M</span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          user={{
            name: user?.email?.split("@")[0] ?? "Admin",
            email: user?.email ?? "",
            avatar: "",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
