import React, { useState, useEffect } from 'react';
import { LoginForm } from '../features/auth/components/LoginForm';
import { RegisterForm } from '../features/auth/components/RegisterForm';
import { useAuthContext } from '../features/auth/context/AuthContext';
import { useRoleRedirect } from '../features/auth/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Star, Users, TrendingUp } from 'lucide-react';

interface AuthPageProps {
  defaultTab?: 'login' | 'register';
  onClose?: () => void;
  redirectAfterAuth?: boolean;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  defaultTab = 'login',
  onClose,
  redirectAfterAuth = true
}) => {
  console.log('AuthPage component rendered with defaultTab:', defaultTab);
  
  const { isAuthenticated } = useAuthContext();
  const { redirectToDefault } = useRoleRedirect();
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    console.log('AuthPage useEffect - isAuthenticated:', isAuthenticated);
    if (isAuthenticated && redirectAfterAuth) {
      redirectToDefault();
    }
  }, [isAuthenticated, redirectAfterAuth, redirectToDefault]);

  const handleAuthSuccess = () => {
    if (redirectAfterAuth) {
      redirectToDefault();
    } else {
      onClose?.();
    }
  };

  const testimonials = [
    {
      name: "Maria Silva",
      role: "Franqueada - Natal/RN",
      text: "Em 6 meses já recuperei meu investimento. A Viral Kids mudou minha vida!",
      rating: 5
    },
    {
      name: "João Santos",
      role: "Franqueado - Petrolina/PE",
      text: "O suporte é incrível e os produtos são únicos. Meus clientes adoram!",
      rating: 5
    },
    {
      name: "Ana Costa",
      role: "Franqueada - Fortaleza/CE",
      text: "Consegui sair do emprego e me dedicar 100% ao meu negócio próprio.",
      rating: 5
    }
  ];

  const stats = [
    { icon: Users, value: "87+", label: "Franquias Ativas" },
    { icon: Star, value: "4.9", label: "Avaliação Média" },
    { icon: TrendingUp, value: "156%", label: "Crescimento Anual" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            {onClose && (
              <Button variant="ghost" onClick={onClose} size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            )}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">VK</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Viral Kids</h1>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Form Section */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Entrar</TabsTrigger>
                  <TabsTrigger value="register">Criar Conta</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <LoginForm
                    onSuccess={handleAuthSuccess}
                    onRegisterClick={() => setActiveTab('register')}
                    onForgotPasswordClick={() => {
                      // TODO: Implementar modal de esqueci senha
                      alert('Funcionalidade em desenvolvimento');
                    }}
                  />
                </TabsContent>

                <TabsContent value="register">
                  <RegisterForm
                    onSuccess={handleAuthSuccess}
                    onLoginClick={() => setActiveTab('login')}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Info Section */}
          <div className="space-y-8">
            {/* Hero Content */}
            <div className="text-center lg:text-left">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Transforme sonhos em
                <span className="text-transparent bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text">
                  {" "}realidade
                </span>
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                Junte-se à maior rede de franquias do universo infantil do Nordeste. 
                Produtos únicos, suporte completo e lucro garantido.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-2">
                      <stat.icon className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                O que nossos franqueados dizem:
              </h3>
              
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-white/70 backdrop-blur border-0 shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {testimonial.name[0]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-900">{testimonial.name}</span>
                          <div className="flex space-x-1">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{testimonial.role}</p>
                        <p className="text-sm text-gray-800 italic">"{testimonial.text}"</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Features */}
            <div className="bg-white/50 backdrop-blur rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Por que escolher a Viral Kids?
              </h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Produtos exclusivos com impressão 3D personalizada</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Sistema de gamificação para franqueados</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Suporte completo de marketing e vendas</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Catálogo com mais de 500 produtos únicos</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Território exclusivo garantido</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>ROI médio de 300% no primeiro ano</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
