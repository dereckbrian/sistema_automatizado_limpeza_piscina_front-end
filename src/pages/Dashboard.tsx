import { useState, useEffect } from "react";
import { MetricCard } from "@/components/MetricCard";
import { ControlCard } from "@/components/ControlCard";
import { CircularGauge } from "@/components/CircularGauge";
import { ChartCard } from "@/components/ChartCard";
import { SuggestionModal } from "@/components/ui/SuggestionModal"; // Certifique-se que o caminho está certo
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

  // --- ESTADOS DO SISTEMA ---
  const [temperaturaAtual, setTemperaturaAtual] = useState(0);
  const [phAtual, setPhAtual] = useState(7.0); 
  const [nivelAgua, setNivelAgua] = useState(false);
  const [turbidezAtual, setTurbidezAtual] = useState(0.5); // Novo estado para Turbidez

  // Configuração do Usuário (Temperatura Mínima)
  const [minTempConfig, setMinTempConfig] = useState(25); // Valor padrão caso não ache

  // Estados para o Modal e Volume
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [suggestionData, setSuggestionData] = useState(null);
  const [volumePiscina, setVolumePiscina] = useState(0);

  // Estados dos Controles
  const [pumpActive, setPumpActive] = useState(false);
  
  const user = localStorage.getItem("userName");

  // --- 1. BUSCAR CONFIGURAÇÕES DO USUÁRIO AO INICIAR ---
  useEffect(() => {
    const carregarConfigsUsuario = async () => {
      const email = localStorage.getItem("userEmail"); // Precisa ter salvo isso no Login
      if (email) {
        try {
          // Busca os dados do usuário para pegar a temperatura minima configurada
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

  // --- FUNÇÃO PARA REGISTRAR LOGS ---
  const registrarHistorico = async (descricao: string) => {
    try {
      await api.post("/api/historicoAdd", { descricao, user });
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

  // --- LÓGICA QUÍMICA COMPLETA ---
  const verificarQuimica = (ph: number, turbidez: number, temperatura: number, volLitros: number) => {
    let produto = "";
    let dosagemPor1000 = 0;
    let motivo = "";
    let unidade = "ml";

    // 1. Lógica de pH (Baseada na Tabela)
    if (ph < 6.8) {
      produto = "pH+ (Líquido)";
      motivo = "pH muito baixo (Abaixo de 6.8)";
      dosagemPor1000 = 20; 
    } else if (ph >= 6.8 && ph < 7.2) { 
       if (ph <= 7.0) {
          produto = "pH+ (Líquido)";
          motivo = "pH levemente baixo (Entre 6.8 e 7.0)";
          dosagemPor1000 = 15; 
       }
    } else if (ph > 7.6) {
      produto = "pH- (Líquido)";
      motivo = "pH alto (Acima de 7.6)";
      dosagemPor1000 = 10; 
    }

    // 2. Lógica de Turbidez (Alerta se estiver suja)
    else if (turbidez > 3.0) {
      produto = "Clarificante";
      motivo = `Água turva (${turbidez} NTU)`;
      dosagemPor1000 = 4; // Exemplo: 4ml por 1000L
      unidade = "ml";
    }

    // 3. Lógica de Temperatura (Aviso Visual apenas)
    else if (temperatura < minTempConfig) {
       // Não gera modal de dosagem, apenas avisa
       toast.info("Temperatura Baixa", {
          description: `A água está a ${temperatura}°C (Mínimo definido: ${minTempConfig}°C).`,
          duration: 5000,
       });
       return; // Sai da função para não abrir o modal lá embaixo
    }

    // --- SE TIVER RECOMENDAÇÃO QUÍMICA ---
    if (produto !== "") {
      const qtdTotal = (volLitros / 1000) * dosagemPor1000;
      
      const dadosSugestao = {
        produto,
        motivo,
        quantidade: `${qtdTotal.toFixed(0)} ${unidade}`
      };

      setSuggestionData(dadosSugestao);

      // Dispara o Toast com lógica de fechar (Dismiss) ao clicar
      const toastId = toast.warning(`Atenção: ${motivo}`, {
        description: "Clique aqui para ver a dosagem de correção.",
        duration: Infinity, // Fica na tela até clicar
        action: {
          label: "Ver Dosagem",
          onClick: () => {
             setIsModalOpen(true); // Abre o modal
             toast.dismiss(toastId); // Fecha o aviso
          },
        },
      });
    }
  };

  // --- BUSCAR DADOS DO SENSOR (LOOP) ---
  useEffect(() => {
    const buscarDados = async () => {
      try {
        const response = await api.get("/api/sensor/atual");
        
        if (response.data && response.data.leitura) {
          const dados = response.data.leitura;
          // Pega o volume que veio do Back-end
          const vol = response.data.volumeLitros || 0;

          setTemperaturaAtual(dados.temperatura || 0);
          setNivelAgua(dados.nivelOk);
          setPumpActive(dados.bombaAtiva);
          // Se o backend não mandar turbidez ainda, usa 0.5 fixo pra não quebrar
          const valTurbidez = dados.turbidez !== undefined ? dados.turbidez : 0.5;
          setTurbidezAtual(valTurbidez);
          
          setVolumePiscina(vol);

          if (dados.ph) {
            setPhAtual(dados.ph);
            
            // Só verifica química se tiver volume válido
            if (vol > 0) {
               // Chama a função passando todos os dados atuais e a config de temperatura
               verificarQuimica(dados.ph, valTurbidez, dados.temperatura, vol);
            }
          }
        }
      } catch (error) {
        console.error("Erro ao buscar sensores:", error);
      }
    };

    buscarDados();
    const intervalo = setInterval(buscarDados, 10000); // Atualiza a cada 10s
    return () => clearInterval(intervalo);
  }, [minTempConfig]); // Recria o loop se a config de temperatura mudar

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
              // Fica laranja se estiver abaixo do configurado pelo usuário
              status={temperaturaAtual < minTempConfig ? "warning" : "normal"}
              gradient
            />
            
            <MetricCard
              title="pH da Água"
              value={phAtual.toFixed(1)}
              unit="pH"
              icon={Droplets}
              // Fica verde APENAS se estiver entre 7.2 e 7.8
              status={(phAtual >= 7.2 && phAtual <= 7.8) ? "normal" : "warning"}
              gradient
            />
            
            <MetricCard
              title="Turbidez"
              value={turbidezAtual.toString()}
              unit="NTU"
              icon={Activity}
              // Fica laranja se estiver muito turva (> 3.0)
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
            
            <CircularGauge
              title="Nível de Água"
              value={nivelAgua ? 100 : 20}
              maxValue={100}
              unit="%"
              icon={Droplets}
              color={nivelAgua ? "primary" : "warning"}
            />
          </div>
        </section>

        {/* Componente do Modal que abre ao clicar no Toast */}
        <SuggestionModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            data={suggestionData} 
        />
    </div>
  );
};

export default Index;