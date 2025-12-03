import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  unit: string;
  icon: LucideIcon;
  status?: "normal" | "warning" | "alert";
  gradient?: boolean;
}

export const MetricCard = ({
  title,
  value,
  unit,
  icon: Icon,
  status = "normal",
  gradient = false,
}: MetricCardProps) => {
  const statusColors = {
    normal: "bg-success/20 border-success/30 text-success",
    warning: "bg-warning/20 border-warning/30 text-warning",
    alert: "bg-destructive/20 border-destructive/30 text-destructive",
  };

  return (
    <Card className={cn(
      "p-6 border-border transition-all duration-300 hover:scale-105 hover:shadow-glow-primary",
      gradient && "bg-gradient-card"
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          "p-3 rounded-xl border",
          statusColors[status]
        )}>
          <Icon className="h-5 w-5" />
        </div>
        <div className={cn(
          "px-2 py-1 rounded-md text-xs font-medium border",
          statusColors[status]
        )}>
          {status === "normal" ? "Normal" : status === "warning" ? "Atenção" : "Alerta"}
        </div>
      </div>
      
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">{title}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-foreground">{value}</span>
          <span className="text-lg text-muted-foreground">{unit}</span>
        </div>
      </div>
    </Card>
  );
};
