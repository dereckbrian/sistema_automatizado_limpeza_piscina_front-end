import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Droplets, Activity, Gauge, Zap } from "lucide-react";

const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-background/95">
      <div className="text-center max-w-2xl px-4">
        <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/50">
          <Droplets className="w-10 h-10 text-primary-foreground" />
        </div>
        <h1 className="mb-4 text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          SmartPool
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Sistema Automatizado para Piscinas
        </p>
        <p className="text-foreground/80 mb-8">
          Monitoramento em tempo real e controle inteligente para manutenção automatizada
        </p>
        
        <div className="flex gap-4 justify-center mb-12">
          <Link to="/auth">
            <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/50">
              Acessar Sistema
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          <div className="flex flex-col items-center p-4 bg-card/50 rounded-lg border border-border/50">
            <Activity className="w-8 h-8 text-primary mb-2" />
            <span className="text-sm text-muted-foreground">Monitoramento</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-card/50 rounded-lg border border-border/50">
            <Gauge className="w-8 h-8 text-accent mb-2" />
            <span className="text-sm text-muted-foreground">Controle</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-card/50 rounded-lg border border-border/50">
            <Zap className="w-8 h-8 text-warning mb-2" />
            <span className="text-sm text-muted-foreground">Automação</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-card/50 rounded-lg border border-border/50">
            <Droplets className="w-8 h-8 text-success mb-2" />
            <span className="text-sm text-muted-foreground">Qualidade</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
