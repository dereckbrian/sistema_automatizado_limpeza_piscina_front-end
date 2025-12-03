import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Bell, Shield, Wifi, Database, Filter } from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
  const handleSave = () => {
    toast.success("Configurações salvas com sucesso!");
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Configurações</h1>
        <p className="text-muted-foreground">Personalize o comportamento do sistema</p>
      </div>

      <Card className="p-6 border-border bg-gradient-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/20 border border-primary/30">
            <Database className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Sistema</h2>
            <p className="text-sm text-muted-foreground">Configurações gerais do sistema</p>
          </div>
        </div>

        <div className="space-y-6">
          
          <Separator className="bg-border" />

          <div className="space-y-2">
            <Label htmlFor="temp-target" className="text-foreground">
              Temperatura Alvo (°C)
            </Label>
            <Input
              id="temp-target"
              type="number"
              defaultValue="27"
              className="max-w-xs bg-secondary border-border"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6 border-border bg-gradient-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-accent/20 border border-accent/30">
            <Bell className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Notificações</h2>
            <p className="text-sm text-muted-foreground">Gerencie alertas e avisos</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-foreground">Alertas por Email</Label>
              <p className="text-sm text-muted-foreground">
                Receber notificações importantes
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator className="bg-border" />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-foreground">Alertas de Manutenção</Label>
              <p className="text-sm text-muted-foreground">
                Lembretes de manutenção preventiva
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator className="bg-border" />

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              Email para Notificações
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              className="bg-secondary border-border"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6 border-border bg-gradient-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-accent/20 border border-accent/30">
            <Filter className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Parâmetros da Piscina</h2>
            <p className="text-sm text-muted-foreground">Gerencie os parâmetros de sua pisc</p>
          </div>
        </div>

        <div className="space-y-6">

          <Separator className="bg-border" />

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Largura
              </Label>
              <Input
                id="largura"
                type="text"
                placeholder="3 metros"
                className="bg-secondary border-border"
              />
            </div>
          <Separator className="bg-border" />

          <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Comprimento
              </Label>
              <Input
                id="comprimento"
                type="text"
                placeholder="8 metros"
                className="bg-secondary border-border"
              />
          </div>

          <Separator className="bg-border" />

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              Profundidade
            </Label>
            <Input
              id="profundidade"
              type="text"
              placeholder="2 metros"
              className="bg-secondary border-border"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6 border-border bg-gradient-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-destructive/20 border border-destructive/30">
            <Shield className="h-5 w-5 text-destructive" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Segurança</h2>
            <p className="text-sm text-muted-foreground">Proteções e limites de segurança</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-foreground">Bloqueio de Emergência</Label>
              <p className="text-sm text-muted-foreground">
                Desligar automaticamente em caso de anomalias críticas
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator className="bg-border" />

          <div className="space-y-2">
            <Label htmlFor="max-chlorine" className="text-foreground">
              Limite Máximo de Cloro (ppm)
            </Label>
            <Input
              id="max-chlorine"
              type="number"
              defaultValue="5"
              className="max-w-xs bg-secondary border-border"
            />
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline">Cancelar</Button>
        <Button onClick={handleSave} className="bg-gradient-primary">
          Salvar Alterações
        </Button>
      </div>
    </div>
  );
};

export default Settings;
