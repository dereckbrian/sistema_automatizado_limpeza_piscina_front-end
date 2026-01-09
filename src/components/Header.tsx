import { Droplet, Wifi, LogOut } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export const Header = () => {
  const navigate = useNavigate();
  
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); 
    window.location.reload(); 
  };

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <div className="p-2 rounded-xl bg-gradient-primary shadow-glow-primary">
              <Droplet className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">IF-Pool</h1>
              <p className="text-xs text-muted-foreground">Sistema Automatizado</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-success/20 border border-success/30">
                <span className="text-success font-medium">
                  {userName ? `Olá, ${userName}` : "Carregando..."}
                </span>
              </div>
            </div>


            <button
              onClick={handleLogout} 
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/20 border border-destructive/30 
                         text-destructive font-medium hover:bg-destructive/30 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
