import { useState, useEffect } from "react";
import { ControlCard } from "@/components/ControlCard";
import { Zap, Filter, Wind, Lightbulb, Waves, Timer } from "lucide-react";
import { toast } from "sonner";
import api from "@/config/axiosConfig.js";

const Controls = () => {

  // --- MUDANÇA 1: O estado inicial da bomba não depende mais do localStorage ---
  // Ele vai ser atualizado pela API logo em seguida.
  const [pumpActive, setPumpActive] = useState(false);

  const [filterActive, setFilterActive] = useState(() => {
    const savedState = localStorage.getItem("filterActive2");
    return savedState ? JSON.parse(savedState) : true;
  });

  const [heaterActive, setHeaterActive] = useState(() => {
    const savedState = localStorage.getItem("heatingActive2");
    return savedState ? JSON.parse(savedState) : false;
  });

  const [timerActive, setTimerActive] = useState(() => {
    const savedState = localStorage.getItem("timingActive2");
    return savedState ? JSON.parse(savedState) : false;
  });

  const user = localStorage.getItem("userName");

  // --- MUDANÇA 2: Adicionamos o "Espião" que busca os dados do sensor ---
  useEffect(() => {
    const buscarDados = async () => {
      try {
        const response = await api.get("/api/sensor/atual");
        
        if (response.data) {
          // LÓGICA AUTOMÁTICA DA BOMBA:
          // O Back-end manda: nivelCheio = true (1) ou false (0)
          // Se nivelCheio for FALSE (Vazio), a bomba deve estar ATIVA (True)
          // O sinal de exclamação (!) inverte o valor.
          setPumpActive(!response.data.nivelCheio);
        }
      } catch (error) {
        console.error("Erro ao sincronizar controles:", error);
      }
    };

    // Busca agora
    buscarDados();
    // E repete a cada 5 segundos
    const intervalo = setInterval(buscarDados, 5000);

    return () => clearInterval(intervalo);
  }, []);

  const registrarHistorico = async (descricao: string) => {
    try {
      await api.post("/api/historicoAdd", { descricao, user });
    } catch (error) {
      console.error("Erro ao registrar histórico:", error);
    }
  };

  const handlePumpToggle = async (checked: boolean) => {
    // OBS: Como o sensor está controlando, se você clicar aqui, 
    // ele vai mudar visualmente, mas daqui a 5 segundos o sensor vai corrigir de volta.
    // Isso é normal em sistemas monitorados.
    setPumpActive(checked);
    const message = checked ? "Bomba ativada manualmente" : "Bomba desativada manualmente";
    toast.success(message);
    await registrarHistorico(message);
  };

  const handleFilterToggle = async (checked: boolean) => {
    setFilterActive(checked);
    localStorage.setItem("filterActive2", JSON.stringify(checked)); 
    const message = checked ? "Filtro ativado" : "Filtro desativado";
    toast.success(message);
    await registrarHistorico(message);
  };

  const handleHeaterToggle = async (checked: boolean) => {
    setHeaterActive(checked);
    localStorage.setItem("heatingActive2", JSON.stringify(checked)); 
    const message = checked ? "Aquecimento iniciado" : "Aquecimento pausado";
    toast.success(message);
    await registrarHistorico(message);
  };

  const handleTimerToggle = async (checked: boolean) => {
    setTimerActive(checked);
    localStorage.setItem("timingActive2", JSON.stringify(checked)); 
    const message = checked ? "Programação iniciada" : "Programação pausada";
    toast.success(message);
    await registrarHistorico(message);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Controles do Sistema</h1>
        <p className="text-muted-foreground">Gerencie todos os equipamentos da piscina</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ControlCard
          title="Bomba de Água"
          // Muda a descrição dinamicamente baseado no estado automático
          description={pumpActive ? "Ativada por Nível Baixo" : "Desligada (Nível OK)"}
          icon={Zap}
          isActive={pumpActive}
          onToggle={handlePumpToggle}
        />
        
        <ControlCard
          title="Sistema de Filtragem"
          description={filterActive ? "Filtrando água" : "Filtro Pausado"}
          icon={Filter}
          isActive={filterActive}
          onToggle={handleFilterToggle}
        />
        
        <ControlCard
          title="Aquecedor"
          description={heaterActive ? "Aquecedor Ligado" : "Aquecedor Desligado"}
          icon={Waves}
          isActive={heaterActive}
          onToggle={handleHeaterToggle}
        />
        
      </div>
    </div>
  );
};

export default Controls;