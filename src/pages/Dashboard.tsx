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
  Wind,
  Timer
} from "lucide-react";
import { toast } from "sonner";
import api from "@/config/axiosConfig.js";

const Index = () => {

  // --- ESTADOS DO SISTEMA ---
  const [temperaturaAtual, setTemperaturaAtual] = useState(0);
  const [phAtual, setPhAtual] = useState(7.0); // Novo estado para o pH
  const [nivelAgua, setNivelAgua] = useState(false);

  // Estados dos Controles
  const [pumpActive, setPumpActive] = useState(false);
  const [filterActive, setFilterActive] = useState(() => {
    const savedState = localStorage.getItem("filterActive");
    return savedState ? JSON.parse(savedState) : true;
  });
  const [cleaningActive, setCleaningActive] = useState(() => {
    const savedState = localStorage.getItem("cleaningActive");
    return savedState ? JSON.parse(savedState) : false;
  });

  const user = localStorage.getItem("userName");

  // --- FUNÇÃO PARA REGISTRAR LOGS ---
  const registrarHistorico = async (descricao: string) => {
    try {
      await api.post("/api/historicoAdd", { descricao, user });
    } catch (error) {
      console.error("Erro ao registrar histórico:", error);
    }
  };

  // --- CONTROLE DA BOMBA (TOGGLE) ---
  const handlePumpToggle = async (checked: boolean) => {
    // 1. Atualiza visualmente na hora (Otimista)
    setPumpActive(checked);
    
    const acao = checked ? "LIGAR" : "DESLIGAR";
    const message = checked ? "Comando: Ligar Bomba enviado" : "Comando: Desligar Bomba enviado";
    
    try {
        // ATENÇÃO: Você precisa criar esse endpoint no Java se quiser controle manual pelo site!
        // Se for só automático, esse botão serve apenas visualmente.
        await api.post("/api/sensor/comando-bomba", { ligar: checked });
        toast.success(message);
        await registrarHistorico(`Usuário alterou bomba para: ${acao}`);
    } catch (error) {
        toast.error("Erro ao enviar comando para a bomba.");
        console.error(error);
        // Se der erro, volta o botão para o estado original
        setPumpActive(!checked);
    }
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

  // --- BUSCA DE DADOS (POLLING 5 SEGUNDOS) ---
  useEffect(() => {
    const buscarDados = async () => {
      try {
        const response = await api.get("/api/sensor/atual");
        
        if (response.data) {
          // Mapeando os dados que vêm do JAVA (SensorController / LeituraSensor)
          setTemperaturaAtual(response.data.temperatura || 0);
          setNivelAgua(response.data.nivelOk); // Boolean
          
          // Novo: Atualiza o pH
          if (response.data.ph) {
            setPhAtual(response.data.ph);
          }

          // Novo: Sincroniza o botão com o estado REAL da bomba (vindo do Arduino)
          // Se o Arduino ligou a bomba sozinho, o botão no site vai ficar verde sozinho
          setPumpActive(response.data.bombaAtiva);
        }
      } catch (error) {
        console.error("Erro ao buscar sensores:", error);
      }
    };

    buscarDados();
    const intervalo = setInterval(buscarDados, 5000); // Atualiza a cada 5s
    return () => clearInterval(intervalo);
  }, []); 

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
              value={temperaturaAtual.toFixed(1)}
              unit="°C"
              icon={Thermometer}
              status={temperaturaAtual < 30 ? "normal" : "warning"}
              gradient
            />
            
            {/* CARD DE PH ATUALIZADO */}
            <MetricCard
              title="pH da Água"
              value={phAtual.toFixed(1)} // Mostra o valor real com 1 casa decimal
              unit="pH"
              icon={Droplets}
              // Lógica de cores: pH ideal entre 7.0 e 7.6
              status={(phAtual >= 7.0 && phAtual <= 7.6) ? "normal" : "warning"}
              gradient
            />
            
            <MetricCard
              title="Turbidez"
              value="0.5"
              unit="NTU"
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
              title="Bomba de Água"
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
            
            {/* GAUGE DE NÍVEL ATUALIZADO */}
            <CircularGauge
              title="Nível de Água"
              value={nivelAgua ? 100 : 20} // Se true (cheio) = 100%, se false = 20%
              maxValue={100}
              unit="%"
              icon={Droplets}
              color={nivelAgua ? "primary" : "warning"}
            />
          </div>
        </section>
    </div>
  );
};

export default Index;