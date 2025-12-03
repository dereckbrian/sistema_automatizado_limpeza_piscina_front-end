import { Card } from "@/components/ui/card";
import { Bell, AlertTriangle, Info, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Alerts = () => {
  const alerts = [
    {
      id: 1,
      type: "warning",
      title: "pH levemente elevado",
      message: "O pH está em 7.8. Recomenda-se ajuste para faixa ideal (7.2-7.6)",
      time: "Há 2 horas",
    },
    {
      id: 3,
      type: "success",
      title: "Sistema operando normalmente",
      message: "Todos os parâmetros dentro dos valores ideais",
      time: "Há 1 dia",
    },
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case "info":
        return <Info className="h-5 w-5 text-accent" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-success" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getAlertStyle = (type: string) => {
    switch (type) {
      case "warning":
        return "bg-warning/10 border-warning/30";
      case "info":
        return "bg-accent/10 border-accent/30";
      case "success":
        return "bg-success/10 border-success/30";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Central de Alertas</h1>
          <p className="text-muted-foreground">Notificações e avisos do sistema</p>
        </div>
        {/* <Button variant="outline" className="gap-2">
          <Bell className="h-4 w-4" />
          Marcar todas como lidas
        </Button> */}
      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-card border-border">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-warning/20 border border-warning/30">
              <AlertTriangle className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Alertas Ativos</p>
              <p className="text-2xl font-bold text-foreground">1</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card border-border">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-accent/20 border border-accent/30">
              <Info className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Informações</p>
              <p className="text-2xl font-bold text-foreground">1</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card border-border">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-success/20 border border-success/30">
              <CheckCircle className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Resolvidos Hoje</p>
              <p className="text-2xl font-bold text-foreground">5</p>
            </div>
          </div>
        </Card>
      </div> */}

      <div className="space-y-4">
        {alerts.map((alert) => (
          <Card
            key={alert.id}
            className={`p-6 border transition-all hover:scale-[1.02] ${getAlertStyle(alert.type)}`}
          >
            <div className="flex items-start gap-4">
              <div className="mt-1">{getAlertIcon(alert.type)}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">{alert.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                <span className="text-xs text-muted-foreground">{alert.time}</span>
              </div>
              {/* <Button variant="ghost" size="sm">
                Resolver
              </Button> */}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Alerts;
