import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // <--- Importante
import { Trash2, History as HistoryIcon, Clock } from "lucide-react"; // <--- Importante
import { toast } from "sonner";
import api from "@/config/axiosConfig.js";

interface HistoricoItem {
  id: number;
  descricao: string;
  dataEvento: string;
}

const Historico = () => {
  const [historyData, setHistoryData] = useState<HistoricoItem[]>([]);
  const carregarHistorico = async () => {
    
    try {
      const response = await api.get("/api/historicoRecuperar");
      setHistoryData(response.data);
    } catch (error) {
      console.error("Erro ao carregar histórico", error);
    }
  };

  useEffect(() => {
    carregarHistorico();
    const interval = setInterval(carregarHistorico, 10000);
    return () => clearInterval(interval);
  }, []);

  const clearHistory = async () => {
    try {
      await api.delete("/api/historicoLimpar");
      setHistoryData([]); 
      toast.success("Histórico limpo com sucesso!");
    } catch (error) {
      console.error("Erro ao limpar histórico:", error);
      toast.error("Erro ao limpar histórico.");
    }
  };

  // Formatar data
  const formatarData = (dataISO: string) => {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) + 
           ", " + 
           data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Histórico de Eventos</h1>
          <p className="text-muted-foreground">Registro completo de atividades e manutenções</p>
        </div>
        {historyData.length > 0 && (
            <Button 
                variant="destructive" 
                onClick={clearHistory}
                className="gap-2"
            >
                <Trash2 className="h-4 w-4" />
                Limpar Histórico
            </Button>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Eventos Recentes</h2>

        {historyData.length === 0 ? (
           <p className="text-muted-foreground">Nenhum evento registrado.</p>
        ) : (
          historyData.map((item) => (
            <Card key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-accent/5 transition-colors">
              <div className="flex items-start gap-3">
                 <div className="mt-1 p-2 bg-primary/10 rounded-full">
                    <HistoryIcon className="h-4 w-4 text-primary" />
                 </div>
                 
                 <div>
                    <p className="font-medium text-foreground">
                        {item.descricao}
                    </p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <Clock className="h-3 w-3" />
                        {formatarData(item.dataEvento)}
                    </div>
                 </div>
              </div>
              
              <div className="text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded self-start sm:self-center">
                  Registrado
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Historico;