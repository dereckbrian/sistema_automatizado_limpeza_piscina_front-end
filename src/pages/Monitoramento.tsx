import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Activity } from "lucide-react";

const Monitoramento = () => {
  return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Activity className="w-8 h-8 text-primary" />
            Monitoramento
          </h1>
          <p className="text-muted-foreground">Acompanhamento em tempo real</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="p-6 bg-card/50 border-border/50">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Temperatura</h3>
            <p className="text-4xl font-bold">27°C</p>
            <p className="text-sm text-success mt-1">Normal</p>
          </Card>

          <Card className="p-6 bg-card/50 border-border/50">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">pH</h3>
            <p className="text-4xl font-bold">7.4</p>
            <p className="text-sm text-success mt-1">Ideal</p>
          </Card>

          <Card className="p-6 bg-card/50 border-border/50">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Turbidez</h3>
            <p className="text-4xl font-bold">0.5 NTU</p>
            <p className="text-sm text-success mt-1">Cristalina</p>
          </Card>
        </div>
      </div>
  );
};

export default Monitoramento;
