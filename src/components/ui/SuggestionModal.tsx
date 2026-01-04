import { X, Beaker, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    produto: string;
    quantidade: string; // Ex: "300 ml"
    motivo: string;
  } | null;
}

export const SuggestionModal = ({ isOpen, onClose, data }: SuggestionModalProps) => {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-md rounded-xl border border-border shadow-2xl p-6 relative animate-in fade-in zoom-in duration-200">
        
        {/* Botão X para fechar o Modal */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center">
            <Beaker className="w-8 h-8 text-yellow-500" />
          </div>

          <h2 className="text-2xl font-bold text-foreground">Ajuste Recomendado</h2>
          
          <div className="bg-secondary/50 p-4 rounded-lg w-full text-left space-y-2 border border-border/50">
            <p className="text-sm text-muted-foreground">Diagnóstico:</p>
            <p className="font-semibold text-foreground">{data.motivo}</p>
          </div>

          <div className="space-y-2 w-full py-2">
            <p className="text-sm text-muted-foreground">Produto a aplicar:</p>
            <p className="text-xl font-bold text-primary">{data.produto}</p>
            
            <div className="text-4xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {data.quantidade}
            </div>
          </div>

          {/* --- AQUI ESTÁ O AVISO QUE ANTES ESTAVA NO TOAST --- */}
          <div className="flex gap-2 text-xs text-left text-muted-foreground bg-muted p-3 rounded-md border border-border">
             <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0" />
             <p>
               <strong>Importante:</strong> Este cálculo utiliza uma concentração média de mercado. 
               Verifique sempre o rótulo do fabricante do seu produto antes da aplicação.
             </p>
          </div>

          <Button onClick={onClose} className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
            Entendido, vou aplicar
          </Button>
          
        </div>
      </div>
    </div>
  );
};