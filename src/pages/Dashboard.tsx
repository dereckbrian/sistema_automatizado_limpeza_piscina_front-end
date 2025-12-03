import { useState, useEffect } from "react";
import { MetricCard } from "@/components/MetricCard";
import { ControlCard } from "@/components/ControlCard";
import { CircularGauge } from "@/components/CircularGauge";
import { ChartCard } from "@/components/ChartCard";
import { 
  Thermometer, 
  Droplets, 
  Activity, 
  Power,
  Filter,
  Zap,
  Beaker,
  Wind,
  Timer
} from "lucide-react";
import { toast } from "sonner";
import api from "@/config/axiosConfig.js";

const Index = () => {
  // Recuperando o estado salvo do localStorage ou usando o valor padrão
  const [pumpActive, setPumpActive] = useState(() => {
    const savedState = localStorage.getItem("pumpActive");
    return savedState ? JSON.parse(savedState) : true;
  });

  const [filterActive, setFilterActive] = useState(() => {
    const savedState = localStorage.getItem("filterActive");
    return savedState ? JSON.parse(savedState) : true;
  });

  const [cleaningActive, setCleaningActive] = useState(() => {
    const savedState = localStorage.getItem("cleaningActive");
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
    localStorage.setItem("pumpActive", JSON.stringify(checked)); 
    const message = checked ? "Bomba ativada" : "Bomba desativada";
    toast.success(message);
    await registrarHistorico(message);
  };

  const handleFilterToggle = async (checked: boolean) => {
    setFilterActive(checked);
    localStorage.setItem("filterActive", JSON.stringify(checked)); 
    const message = checked ? "Filtro ativado" : "Filtro desativado";
    toast.success(message);
    await registrarHistorico(message);
  };

  const handleCleaningToggle = async (checked: boolean) => {
    setCleaningActive(checked);
    localStorage.setItem("cleaningActive", JSON.stringify(checked)); 
    const message = checked ? "Limpeza iniciada" : "Limpeza pausada";
    toast.success(message);
    await registrarHistorico(message);
  };

  return (
    <div className="space-y-8">
        <section className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Sistema Automatizado para Piscinas
          </h1>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            Qualidade da Água
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <MetricCard
              title="Temperatura"
              value="27"
              unit="°C"
              icon={Thermometer}
              status="normal"
              gradient
            />
            
            <MetricCard
              title="pH da Água"
              value="7.2"
              unit="pH"
              icon={Droplets}
              status="normal"
              gradient
            />
            
            <MetricCard
              title="Alcalinidade"
              value="95"
              unit="ppm"
              icon={Activity}
              status="normal"
              gradient
            />
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Power className="h-6 w-6 text-primary" />
            Controles do Sistema
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <ControlCard
              title="Bomba de Circulação"
              description={pumpActive ? "Em operação" : "Desligada"}
              icon={Zap}
              isActive={pumpActive}
              onToggle={handlePumpToggle}
            />
            
            <ControlCard
              title="Sistema de Filtragem"
              description={filterActive ? "Filtrando água" : "Pausado"}
              icon={Filter}
              isActive={filterActive}
              onToggle={handleFilterToggle}
            />
            
            <ControlCard
              title="Limpeza Automática"
              description={cleaningActive ? "Em andamento" : "Aguardando"}
              icon={Wind}
              isActive={cleaningActive}
              onToggle={handleCleaningToggle}
            />
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <ChartCard />
          </div>
          
          <div className="space-y-4">
            <CircularGauge
              title="Consumo de Energia"
              value={65}
              maxValue={100}
              unit="kWh"
              icon={Zap}
              color="warning"
            />
          </div>
        </div>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Timer className="h-6 w-6 text-primary" />
            Estatísticas de Operação
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <CircularGauge
              title="Tempo de Filtragem Hoje"
              value={6.5}
              maxValue={8}
              unit="horas"
              icon={Timer}
              color="accent"
            />
            
            <CircularGauge
              title="Eficiência do Sistema"
              value={92}
              maxValue={100}
              unit="%"
              icon={Activity}
              color="success"
            />
            
            <CircularGauge
              title="Nível de Água"
              value={85}
              maxValue={100}
              unit="%"
              icon={Droplets}
              color="primary"
            />
          </div>
        </section>
    </div>
  );
};

export default Index;
