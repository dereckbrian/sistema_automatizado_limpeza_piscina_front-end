import { Card } from "@/components/ui/card";
import { Calendar, TrendingUp, TrendingDown } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/config/axiosConfig.js";
import { toast } from "sonner";

const History = () => {
  const [historyData, setHistoryData] = useState([]);

  const fetchHistory = async () => {
    try {
      const response = await api.get("/api/historicoRecuperar"); 
      setHistoryData(response.data);  
    } catch (error) {
      console.error("Erro ao buscar histórico:", error);
    }
  };

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

  useEffect(() => {
    fetchHistory();
  }, []);  

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Histórico de Eventos</h1>
        <p className="text-muted-foreground">Registro completo de atividades e manutenções</p>
        <button
          onClick={clearHistory}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Limpar Histórico
        </button>
      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-card border-border">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-success/20 border border-success/30">
              <TrendingUp className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Eventos este mês</p>
              <p className="text-2xl font-bold text-foreground">{eventsThisMonth}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card border-border">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-warning/20 border border-warning/30">
              <TrendingDown className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Alertas</p>
              <p className="text-2xl font-bold text-foreground">3</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card border-border">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/20 border border-primary/30">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Manutenções</p>
              <p className="text-2xl font-bold text-foreground">12</p>
            </div>
          </div>
        </Card>
      </div> */}

      <Card className="border-border bg-gradient-card">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Eventos Recentes</h2>
        </div>
        <div className="divide-y divide-border">
          {historyData && historyData.length > 0 ? (
            historyData.map((item, index) => (
              <div key={index} className="p-4 hover:bg-secondary/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full bg-muted`} />
                    <div>
                      <p className="font-medium text-foreground">{item.descricao}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(item.dataEvento).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-muted/20 text-muted">
                    Registrado
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center">Nenhum evento registrado.</div>
          )}
        </div>
      </Card>

    </div>
  );
};

export default History;
