import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CircularGaugeProps {
  title: string;
  value: number;
  maxValue: number;
  unit: string;
  icon: LucideIcon;
  color?: "primary" | "accent" | "success" | "warning";
}

export const CircularGauge = ({
  title,
  value,
  maxValue,
  unit,
  icon: Icon,
  color = "primary",
}: CircularGaugeProps) => {
  const percentage = (value / maxValue) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const colorClasses = {
    primary: "stroke-primary shadow-glow-primary",
    accent: "stroke-accent shadow-glow-accent",
    success: "stroke-success",
    warning: "stroke-warning",
  };

  return (
    <Card className="p-6 border-border bg-gradient-card hover:scale-105 transition-all duration-300">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">{title}</h3>
      
      <div className="relative flex flex-col items-center">
        <svg className="w-32 h-32 transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="64"
            cy="64"
            r="45"
            stroke="hsl(var(--border))"
            strokeWidth="8"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx="64"
            cy="64"
            r="45"
            className={cn("transition-all duration-1000", colorClasses[color])}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Icon className={cn("h-6 w-6 mb-1", color === "primary" && "text-primary")} />
          <span className="text-2xl font-bold text-foreground">{value}</span>
          <span className="text-xs text-muted-foreground">{unit}</span>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <span className="text-sm text-muted-foreground">
          {percentage.toFixed(0)}% do máximo
        </span>
      </div>
    </Card>
  );
};
