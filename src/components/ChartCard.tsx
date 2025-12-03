import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export const ChartCard = () => {
  return (
    <Card className="p-6 border-border bg-gradient-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Qualidade da Água</h3>
          <p className="text-sm text-muted-foreground">Últimos 7 dias</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-success/20 border border-success/30">
          <TrendingUp className="h-4 w-4 text-success" />
          <span className="text-sm font-medium text-success">+12%</span>
        </div>
      </div>
      
      <div className="relative h-48">
        {/* Simplified wave visualization */}
        <svg className="w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none">
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(190 80% 50%)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="hsl(190 80% 50%)" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path
            d="M0,75 Q50,50 100,75 T200,75 T300,75 T400,75 L400,150 L0,150 Z"
            fill="url(#waveGradient)"
            className="animate-pulse"
          />
          <path
            d="M0,75 Q50,50 100,75 T200,75 T300,75 T400,75"
            fill="none"
            stroke="hsl(190 80% 50%)"
            strokeWidth="2"
            className="drop-shadow-glow-accent"
          />
        </svg>
        
        {/* Timeline labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-muted-foreground px-2">
          <span>Seg</span>
          <span>Ter</span>
          <span>Qua</span>
          <span>Qui</span>
          <span>Sex</span>
          <span>Sáb</span>
          <span>Dom</span>
        </div>
      </div>
    </Card>
  );
};
