import { useState, useEffect } from "react";
import { MetricCard } from "@/components/MetricCard";
import { ControlCard } from "@/components/ControlCard";
import { CircularGauge } from "@/components/CircularGauge";
import { ChartCard } from "@/components/ChartCard";
import { SuggestionModal } from "@/components/ui/SuggestionModal";
import { 
  Thermometer, 
  Droplets, 
  Activity, 
  Power,
  Zap,
  Timer
} from "lucide-react";
import { toast } from "sonner";
import api from "@/config/axiosConfig.js";

const Index = () => {

  const [temperaturaAtual, setTemperaturaAtual] = useState(0);
  const [phAtual, setPhAtual] = useState(7.0); 
  const [nivelAgua, setNivelAgua] = useState(false);
  const [turbidezAtual, setTurbidezAtual] = useState(0.5); 
  const [minTempConfig, setMinTempConfig] = useState(25); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [suggestionData, setSuggestionData] = useState(null);
  const [volumePiscina, setVolumePiscina] = useState(0);
  const [pumpActive, setPumpActive] = useState(false);
  const [chartData, setChartData] = useState([]);
  const user = localStorage.getItem("userName");

  useEffect(() => {
    const carregarConfigsUsuario = async () => {
      const email = localStorage.getItem("userEmail"); 
      if (email) {
        try {
          const res = await api.get(`/api/user/me?email=${email}`);
          if (res.data && res.data.temperaturaMinima) {
             setMinTempConfig(res.data.temperaturaMinima);
          }
        } catch (error) {
          console.error("Erro ao carregar configurações do usuário", error);
        }
      }
    };
    carregarConfigsUsuario();
  }, []);

  const salvarAlertaNoBanco = async (titulo: string, mensagem: string, tipo: string) => {
     const email = localStorage.getItem("userEmail");
     if (!email) return;

     try {
       await api.post("/api/alertas/criar", {
         email,
         titulo,
         mensagem,
         tipo
       });
     } catch (error) {
       console.error("Erro ao salvar alerta", error);
     }
  };

  const registrarHistorico = async (descricao: string) => {
    const email = localStorage.getItem("userEmail"); 
    
    if (!email) return;

    try {
      await api.post("/api/historicoAdd", { descricao, email });
    } catch (error) {
      console.error("Erro ao registrar histórico:", error);
    }
  };

  const handlePumpToggle = async (checked: boolean) => {
    setPumpActive(checked);
    const acao = checked ? "LIGAR" : "DESLIGAR";
    const message = checked ? "Comando: Ligar Bomba enviado" : "Comando: Desligar Bomba enviado";
    
    try {
        await api.post("/api/sensor/comando-bomba", { ligar: checked });
        toast.success(message);
        await registrarHistorico(`Usuário alterou bomba para: ${acao}`);
    } catch (error) {
        toast.error("Erro ao enviar comando para a bomba.");
        console.error(error);
        setPumpActive(!checked);
    }
  };

  const formatarHora = (dataISO: string) => {
    const data = new Date(dataISO);
    return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const carregarHistorico = async () => {
    try {
      const response = await api.get("/api/sensor/historico");
      if (response.data) {
        const dadosFormatados = response.data.map((item: any) => ({
          horario: formatarHora(item.dataHora),
          temp: item.temperatura,
          ph: item.ph,
          turbidez: item.turbidez !== undefined ? item.turbidez : 0
        }));
        setChartData(dadosFormatados);
      }
    } catch (error) {
      console.error("Erro ao carregar histórico", error);
    }
  };

  useEffect(() => {
    const buscarDados = async () => {
       await carregarHistorico();
    };

    buscarDados();
    const intervalo = setInterval(buscarDados, 10000); 
    return () => clearInterval(intervalo);
  }, [minTempConfig]);

  const verificarQuimica = (ph: number, turbidez: number, temperatura: number, volLitros: number) => {

    if (temperatura < minTempConfig) {
       const titulo = "Temperatura Baixa";
       const msg = `A água está a ${temperatura}°C (Mínimo: ${minTempConfig}°C).`;
       toast.info(titulo, {
          description: msg,
          duration: 5000,
       });
       salvarAlertaNoBanco(titulo, msg, "info");
    }

    let produto = "";
    let dosagemPor1000 = 0;
    let motivo = "";
    let unidade = "ml";

    if (ph < 6.8) {
      produto = "pH+ (Líquido)";
      motivo = "pH muito baixo (< 6.8)";
      dosagemPor1000 = 20; 
    } else if (ph >= 6.8 && ph < 7.2) { 
       if (ph <= 7.0) {
          produto = "pH+ (Líquido)";
          motivo = "pH levemente baixo";
          dosagemPor1000 = 15; 
       }
    } else if (ph > 7.6) {
      produto = "pH- (Líquido)";
      motivo = "pH alto (> 7.6)";
      dosagemPor1000 = 10; 
    }
    else if (turbidez > 3.0) {
      produto = "Clarificante";
      motivo = `Água turva (${turbidez} NTU)`;
      dosagemPor1000 = 4;
    }

    if (produto !== "") {
      const qtdTotal = (volLitros / 1000) * dosagemPor1000;
      const dadosSugestao = {
        produto,
        motivo,
        quantidade: `${qtdTotal.toFixed(0)} ${unidade}`
      };
      setSuggestionData(dadosSugestao);

      salvarAlertaNoBanco(
          `Atenção: ${motivo}`, 
          `Necessário aplicar ${qtdTotal.toFixed(0)} ${unidade} de ${produto}`, 
          "warning"
      );

      const toastId = toast.warning(`Atenção: ${motivo}`, {
        description: "Ação necessária. Clique para ver a solução.",
        duration: Infinity,
        action: {
          label: "Ver Dosagem",
          onClick: () => {
             setIsModalOpen(true);
             toast.dismiss(toastId); 
          },
        },
      });
    }
  };

  useEffect(() => {
    const buscarDados = async () => {
      try {
        const response = await api.get("/api/sensor/atual");
        
        if (response.data && response.data.leitura) {
          const dados = response.data.leitura;
          const vol = response.data.volumeLitros || 0;

          setTemperaturaAtual(dados.temperatura || 0);
          setNivelAgua(dados.nivelOk);
          setPumpActive(dados.bombaAtiva);
          const valTurbidez = dados.turbidez !== undefined ? dados.turbidez : 0.5;
          setTurbidezAtual(valTurbidez);
          
          setVolumePiscina(vol);

          if (dados.ph) {
            setPhAtual(dados.ph);
            
            if (vol > 0) {
               verificarQuimica(dados.ph, valTurbidez, dados.temperatura, vol);
            }
          }
        }
      } catch (error) {
        console.error("Erro ao buscar sensores:", error);
      }
    };

    buscarDados();
    const intervalo = setInterval(buscarDados, 10000); 
    return () => clearInterval(intervalo);
  }, [minTempConfig]); 

  return (
    <div className="space-y-8 relative"> 
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
              status={temperaturaAtual < minTempConfig ? "warning" : "normal"}
              gradient
            />
            
            <MetricCard
              title="pH da Água"
              value={phAtual.toFixed(1)}
              unit="pH"
              icon={Droplets}
              status={(phAtual >= 7.2 && phAtual <= 7.8) ? "normal" : "warning"}
              gradient
            />
            
            <MetricCard
              title="Turbidez"
              value={turbidezAtual.toString()}
              unit="NTU"
              icon={Activity}
              status={turbidezAtual > 3.0 ? "warning" : "normal"}
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
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-3">
            <ChartCard data={chartData} />
          </div>
        </div>

        <SuggestionModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            data={suggestionData} 
        />
    </div>
  );
};

export default Index;