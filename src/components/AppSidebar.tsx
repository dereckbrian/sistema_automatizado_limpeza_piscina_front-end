import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Activity,
  Settings,
  Bell,
  History,
  Sliders,
  Droplet,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Monitoramento",
    url: "/monitoramento",
    icon: Activity,
  },
  {
    title: "Controles",
    url: "/controles",
    icon: Sliders,
  },
  {
    title: "Histórico",
    url: "/historico",
    icon: History,
  },
  {
    title: "Alertas",
    url: "/alertas",
    icon: Bell,
  },
  {
    title: "Configurações",
    url: "/configuracoes",
    icon: Settings,
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-card">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2 px-2 py-4">
            <div className="p-1.5 rounded-lg bg-gradient-primary">
              <Droplet className="h-4 w-4 text-primary-foreground" />
            </div>
            {state === "expanded" && (
              <span className="font-bold text-foreground">SmartPool</span>
            )}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className={cn(
                      "transition-all duration-200",
                      isActive(item.url) &&
                        "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                    )}
                  >
                    <NavLink to={item.url}>
                      <item.icon className="h-5 w-5" />
                      {state === "expanded" && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
