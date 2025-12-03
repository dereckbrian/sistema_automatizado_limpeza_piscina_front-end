import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Droplets, LayoutDashboard, Activity, Sliders, Clock, Bell, Settings } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/monitoramento", icon: Activity, label: "Monitoramento" },
    { path: "/controles", icon: Sliders, label: "Controles" },
    { path: "/historico", icon: Clock, label: "Histórico" },
    { path: "/alertas", icon: Bell, label: "Alertas" },
    { path: "/configuracoes", icon: Settings, label: "Configurações" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-52 bg-card border-r border-border/50 flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Droplets className="w-5 h-5 text-primary-foreground" />
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-card border-b border-border/50 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Droplets className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold">SmartPool</h1>
              <p className="text-xs text-muted-foreground">Sistema Automatizado</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/20 text-success">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-sm font-medium">Online</span>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">24 de Agosto</p>
              <p className="text-sm font-bold">15:00</p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
