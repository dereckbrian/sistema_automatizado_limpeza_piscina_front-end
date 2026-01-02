import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Database, Filter } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import api from "@/config/axiosConfig.js";

const Settings = () => {
  const [formData, setFormData] = useState({
    largura: "",
    comprimento: "",
    profundidade: "",
    temperaturaMinima: "" // Novo campo
  });

  // Pega o email salvo no login (Adicione isso no seu Auth.tsx se não tiver)
  const userEmail = localStorage.getItem("userEmail"); // ou pegue do token decodificado

  // 1. Carregar dados
  useEffect(() => {
    const buscarDados = async () => {
      if (!userEmail) return;

      try {
        // Chama o novo endpoint passando o email
        const response = await api.get(`/api/user/me?email=${userEmail}`);

        if (response.data) {
          setFormData({
            largura: response.data.larguraPiscina || "",
            comprimento: response.data.comprimentoPiscina || "",
            profundidade: response.data.profundidadePiscina || "",
            temperaturaMinima: response.data.temperaturaMinima || "27"
          });
        }
      } catch (error) {
        console.error("Erro:", error);
        toast.error("Erro ao carregar dados.");
      }
    };

    buscarDados();
  }, [userEmail]);

  // 2. Controla inputs
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  // 3. Salvar no Banco
  const handleSave = async () => {
    try {
      await api.put("/api/user/update", {
        email: userEmail,
        largura: parseFloat(formData.largura),
        comprimento: parseFloat(formData.comprimento),
        profundidade: parseFloat(formData.profundidade),
        temperaturaMinima: parseFloat(formData.temperaturaMinima)
      });
      
      toast.success("Configurações atualizadas no banco de dados!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar configurações.");
    }
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
            <h2 className="text-xl font-semibold">Sistema de Alertas</h2>
          </div>
        </div>

        <div className="space-y-6">
          <Separator className="bg-border" />
          <div className="space-y-2">
            <Label htmlFor="temperaturaMinima">Temperatura Mínima Ideal (°C)</Label>
            <p className="text-xs text-muted-foreground">Alertar se cair abaixo de:</p>
            <Input
              id="temperaturaMinima"
              type="number"
              className="max-w-xs bg-secondary border-border"
              value={formData.temperaturaMinima}
              onChange={handleChange}
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
             <h2 className="text-xl font-semibold">Dimensões da Piscina</h2>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="space-y-2">
                <Label htmlFor="largura">Largura (m)</Label>
                <Input id="largura" type="number" value={formData.largura} onChange={handleChange} className="bg-secondary" />
             </div>
             <div className="space-y-2">
                <Label htmlFor="comprimento">Comprimento (m)</Label>
                <Input id="comprimento" type="number" value={formData.comprimento} onChange={handleChange} className="bg-secondary" />
             </div>
             <div className="space-y-2">
                <Label htmlFor="profundidade">Profundidade (m)</Label>
                <Input id="profundidade" type="number" value={formData.profundidade} onChange={handleChange} className="bg-secondary" />
             </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-4">
        <Button onClick={handleSave} className="bg-primary text-white">
          Salvar Alterações
        </Button>
      </div>
    </div>
  );
};

export default Settings;