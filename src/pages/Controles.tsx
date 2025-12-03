import { useState, useEffect } from "react";
import { ControlCard } from "@/components/ControlCard";
import { Zap, Filter, Wind, Lightbulb, Waves, Timer } from "lucide-react";
import { toast } from "sonner";
import api from "@/config/axiosConfig.js";

const Controls = () => {

  const [pumpActive, setPumpActive] = useState(() => {
    const savedState = localStorage.getItem("pumpActive2");
    return savedState ? JSON.parse(savedState) : true;
  });

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

  const registrarHistorico = async (descricao: string) => {
    try {
      await api.post("/api/historicoAdd", { descricao, user });
    } catch (error) {
      console.error("Erro ao registrar histórico:", error);
    }
  };

  const handlePumpToggle = async (checked: boolean) => {
    setPumpActive(checked);
    localStorage.setItem("pumpActive2", JSON.stringify(checked)); 
    const message = checked ? "Bomba ativada" : "Bomba desativada";
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

  // Função para gerar a mensagem amigável
  const getToggleMessage = (name: string, checked: boolean) => {
    switch (name) {
      case "pumpActive":
        return checked ? "Bomba ligada" : "Bomba desligada";
      case "filterActive":
        return checked ? "Filtro ativado" : "Filtro desativado";
      case "heaterActive":
        return checked ? "Aquecedor ligado" : "Aquecedor desligado";
      case "timerActive":
        return checked ? "Programação automática ativada" : "Programação automática desativada";
      case "cleaningActive":
        return checked ? "Limpeza iniciada" : "Limpeza pausada";
      case "lightsActive":
        return checked ? "Luzes ligadas" : "Luzes desligadas";
      default:
        return `${name} ${checked ? "ativado" : "desativado"}`;
    }
  };

  // Função para salvar o estado no localStorage
  const saveState = (name: string, value: boolean) => {
    localStorage.setItem(name, JSON.stringify(value));
  };

  // Função que lida com o toggle e salva a mudança
  const handleToggle = async (name: string, checked: boolean) => {
    const message = getToggleMessage(name, checked);

    // Exibe a notificação de sucesso
    toast.success(message);

    // Salva o estado no localStorage
    saveState(name, checked);

    // Registra o histórico no banco de dados
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
          title="Bomba de Circulação"
          description={pumpActive ? "Bomba em Operação" : "Bomba Desligada"}
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
        
        <ControlCard
          title="Programação Automática"
          description={timerActive ? "Agendamentos ativos" : "Agendamentos Desativados"}
          icon={Timer}
          isActive={timerActive}
          onToggle={handleTimerToggle}
        />
      </div>
    </div>
  );
};

export default Controls;
