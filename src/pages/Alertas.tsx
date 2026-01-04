import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Bell, AlertTriangle, Info, CheckCircle } from "lucide-react";
import api from "@/config/axiosConfig.js";

// Interface para tipar os dados que vêm do Java
interface Alerta {
  id: number;
  titulo: string;
  mensagem: string;
  tipo: string;
  dataHora: string;
}

const Alerts = () => {
  const [alerts, setAlerts] = useState<Alerta[]>([]);

  // Carregar alertas do Back-end
  useEffect(() => {
    const carregarAlertas = async () => {
      const email = localStorage.getItem("userEmail");
      if (!email) return;

      try {
        const response = await api.get(`/api/alertas/listar?email=${email}`);
        setAlerts(response.data);
      } catch (error) {
        console.error("Erro ao carregar alertas", error);
      }
    };

    carregarAlertas();
    // Opcional: Atualizar a cada 10 segundos
    const interval = setInterval(carregarAlertas, 10000);
    return () => clearInterval(interval);
  }, []);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning": return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "info": return <Info className="h-5 w-5 text-blue-500" />;
      case "success": return <CheckCircle className="h-5 w-5 text-green-500" />;
      default: return <Bell className="h-5 w-5" />;
    }
  };

  const getAlertStyle = (type: string) => {
    switch (type) {
      case "warning": return "bg-yellow-500/10 border-yellow-500/30";
      case "info": return "bg-blue-500/10 border-blue-500/30";
      case "success": return "bg-green-500/10 border-green-500/30";
      default: return "bg-muted";
    }
  };

  // Formatar data (ex: 2024-01-04T10:00 -> 04/01 às 10:00)
  const formatarData = (dataISO: string) => {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + 
           " às " + 
           data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Central de Alertas</h1>
          <p className="text-muted-foreground">Histórico de ocorrências do sistema</p>
        </div>
      </div>

      <div className="space-y-4">
        {alerts.length === 0 ? (
           <p className="text-muted-foreground">Nenhum alerta registrado.</p>
        ) : (
          alerts.map((alert) => (
            <Card
              key={alert.id}
              className={`p-6 border transition-all hover:scale-[1.01] ${getAlertStyle(alert.tipo)}`}
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">{getAlertIcon(alert.tipo)}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">{alert.titulo}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{alert.mensagem}</p>
                  <span className="text-xs text-muted-foreground">
                    {formatarData(alert.dataHora)}
                  </span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Alerts;