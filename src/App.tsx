import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Monitoramento from "./pages/Monitoramento";
import Controles from "./pages/Controles";
import Historico from "./pages/Historico";
import Alertas from "./pages/Alertas";
import Configuracoes from "./pages/Configuracoes";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./pages/ProtectRoute";

const queryClient = new QueryClient();

const Layout = ({ children }: { children: React.ReactNode }) => (
  <SidebarProvider>
    <div className="flex w-full min-h-screen bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  </SidebarProvider>
);

const App = () => (

  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
          <Route path="/monitoramento" element={<ProtectedRoute><Layout><Monitoramento /></Layout></ProtectedRoute>} />
          <Route path="/controles" element={<ProtectedRoute><Layout><Controles /></Layout></ProtectedRoute>} />
          <Route path="/historico" element={<ProtectedRoute><Layout><Historico /></Layout></ProtectedRoute>} />
          <Route path="/alertas" element={<ProtectedRoute><Layout><Alertas /></Layout></ProtectedRoute>} />
          <Route path="/configuracoes" element={<ProtectedRoute><Layout><Configuracoes /></Layout></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
