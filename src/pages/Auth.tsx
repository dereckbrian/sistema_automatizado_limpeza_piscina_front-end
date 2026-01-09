import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/config/axiosConfig.js";

const Auth = () => { 
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    role: "user",
    larguraPiscina: "",
    comprimentoPiscina: "",
    profundidadePiscina: "",
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validações básicas
    if (!formData.email || !formData.password) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (!isLogin) {
      if (!formData.name) {
        toast({
          title: "Erro",
          description: "Por favor, preencha seu nome completo.",
          variant: "destructive",
        });
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Erro",
          description: "As senhas não coincidem.",
          variant: "destructive",
        });
        return;
      }

    };

    try {
      let response;

      if (isLogin) {
        response = await api.post("/auth/login", {
          email: formData.email,
          password: formData.password,
        });
      } else {
        response = await api.post("/auth/register", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          larguraPiscina: parseFloat(formData.larguraPiscina),
          comprimentoPiscina: parseFloat(formData.comprimentoPiscina),
          profundidadePiscina: parseFloat(formData.profundidadePiscina),
        });
      }

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      if (response.data.name) {
        localStorage.setItem("userName", response.data.name);
      }

      localStorage.setItem("userEmail", formData.email);

      toast({
        title: "Sucesso!",
        description: isLogin
          ? "Login realizado com sucesso!"
          : "Conta criada com sucesso!",
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Erro na autenticação:", error);

      toast({
        title: "Erro",
        description:
          error.response?.data?.message ||
          "E-mail ou senha incorreto",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-background to-background/95">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 -top-48 -left-48 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo and brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary/50">
            <Droplets className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            IF-Pool
          </h1>
          <p className="text-muted-foreground mt-1">Sistema Automatizado</p>
        </div>

        {/* Auth card */}
        <Card className="border-border/50 backdrop-blur-sm bg-card/80 shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {isLogin ? "Bem-vindo de volta" : "Criar conta"}
            </CardTitle>
            <CardDescription className="text-center">
              {isLogin
                ? "Entre com suas credenciais para acessar o sistema"
                : "Preencha os dados para criar sua conta"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="João Silva"
                    value={formData.name}
                    onChange={handleInputChange}
                    required={!isLogin}
                    className="bg-background/50 border-border/50"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="bg-background/50 border-border/50"
                />
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="larguraPiscina">Largura da piscina</Label>
                  <div className="relative">
                    <Input
                      id="larguraPiscina"
                      name="larguraPiscina"
                      type="number"
                      placeholder="5m"
                      value={formData.larguraPiscina}
                      onChange={handleInputChange}
                      required={!isLogin}
                      className="bg-background/50 border-border/50 pr-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>

                  <Label htmlFor="larguraPiscina">Profundidade da piscina</Label>
                  <div className="relative">
                    <Input
                      id="profundidadePiscina"
                      name="profundidadePiscina"
                      type="number"
                      placeholder="1.8m"
                      value={formData.profundidadePiscina}
                      onChange={handleInputChange}
                      required={!isLogin}
                      className="bg-background/50 border-border/50 pr-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>

                  <Label htmlFor="larguraPiscina">Comprimento da piscina</Label>
                  <div className="relative">
                    <Input
                      id="comprimentoPiscina"
                      name="comprimentoPiscina"
                      type="number"
                      placeholder="10m"
                      value={formData.comprimentoPiscina}
                      onChange={handleInputChange}
                      required={!isLogin}
                      className="bg-background/50 border-border/50 pr-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="bg-background/50 border-border/50 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar senha</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required={!isLogin}
                      className="bg-background/50 border-border/50 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}


              <Button
                // Removida a chamada a 'quandoClicado'. O 'type="submit"' do botão
                // e o 'onSubmit={handleSubmit}' do <form> são suficientes.
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/50 transition-all hover:shadow-xl hover:shadow-primary/50"
              >
                {isLogin ? "Entrar" : "Criar conta"} 
              </Button>

              {/* {isLogin && (
                <Button
                  type="button"
                  variant="link"
                  className="w-full text-muted-foreground hover:text-primary"
                >
                  Esqueceu sua senha?
                </Button>
              )} */}
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}
                <Button
                  type="button"
                  variant="link"
                  className="ml-1 text-primary hover:text-primary/80 p-0"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? "Criar conta" : "Fazer login"}
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Ao continuar, você concorda com nossos Termos de Serviço e Política de Privacidade
        </p>
      </div>
    </div>
  );
};

export default Auth;
