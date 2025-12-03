import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface ControlCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  isActive: boolean;
  onToggle: (checked: boolean) => void;
}

export const ControlCard = ({
  title,
  description,
  icon: Icon,
  isActive,
  onToggle,
}: ControlCardProps) => {
  return (
    <Card className="p-6 border-border bg-gradient-card hover:scale-105 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={cn(
            "p-3 rounded-xl transition-all duration-300",
            isActive
              ? "bg-primary shadow-glow-primary"
              : "bg-secondary"
          )}>
            <Icon className={cn(
              "h-5 w-5 transition-colors",
              isActive ? "text-primary-foreground" : "text-muted-foreground"
            )} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        
        <Switch
          checked={isActive}
          onCheckedChange={onToggle}
          className="data-[state=checked]:bg-primary"
        />
      </div>
    </Card>
  );
};
