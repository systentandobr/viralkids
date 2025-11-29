import React, { useState } from 'react';
import { useNavigation } from '../stores/additional/navigation.store';
import { useRouter } from '../router';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  ShoppingCart, 
  User, 
  MapPin, 
  CreditCard, 
  CheckCircle,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

interface CheckoutStep {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
}

const CHECKOUT_STEPS: CheckoutStep[] = [
  {
    id: 'cart',
    title: 'Carrinho',
    icon: <ShoppingCart className="h-5 w-5" />,
    description: 'Revise seus itens'
  },
  {
    id: 'customer',
    title: 'Dados Pessoais',
    icon: <User className="h-5 w-5" />,
    description: 'Informações do cliente'
  },
  {
    id: 'shipping',
    title: 'Entrega',
    icon: <MapPin className="h-5 w-5" />,
    description: 'Endereço e frete'
  },
  {
    id: 'payment',
    title: 'Pagamento',
    icon: <CreditCard className="h-5 w-5" />,
    description: 'Forma de pagamento'
  },
  {
    id: 'confirmation',
    title: 'Confirmação',
    icon: <CheckCircle className="h-5 w-5" />,
    description: 'Resumo do pedido'
  }
];

interface CheckoutStepsProps {
  currentStep: string;
  onStepChange: (step: string) => void;
}

export const CheckoutSteps: React.FC<CheckoutStepsProps> = ({
  currentStep,
  onStepChange
}) => {
  const { setBreadcrumbs, addPage, closeAllSidebars } = useNavigation();
  const { navigate } = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  // Configurar breadcrumbs baseado no step atual
  React.useEffect(() => {
    const currentStepIndex = CHECKOUT_STEPS.findIndex(step => step.id === currentStep);
    const breadcrumbs = [
      { label: 'Home', path: '/', isActive: false },
      { label: 'Carrinho', path: '/checkout/cart', isActive: currentStep === 'cart' },
    ];

    if (currentStepIndex > 0) {
      breadcrumbs.push(
        { label: 'Checkout', path: '/checkout', isActive: false },
        { label: CHECKOUT_STEPS[currentStepIndex].title, path: `/checkout/${currentStep}`, isActive: true }
      );
    }

    setBreadcrumbs(breadcrumbs);
    addPage(`/checkout/${currentStep}`, `Checkout - ${CHECKOUT_STEPS[currentStepIndex]?.title || 'Carrinho'}`);
  }, [currentStep, setBreadcrumbs, addPage]);

  const currentStepIndex = CHECKOUT_STEPS.findIndex(step => step.id === currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === CHECKOUT_STEPS.length - 1;

  const handleNext = () => {
    if (!isLastStep) {
      const nextStep = CHECKOUT_STEPS[currentStepIndex + 1];
      onStepChange(nextStep.id);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      const prevStep = CHECKOUT_STEPS[currentStepIndex - 1];
      onStepChange(prevStep.id);
    }
  };

  const handleBackToCart = () => {
    closeAllSidebars();
    navigate('/');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'cart':
        return (
          <div className="space-y-4">
            <div className="text-center py-8">
              <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Seu Carrinho</h3>
              <p className="text-gray-600">Revise os itens antes de continuar</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-base text-gray-600">Carrinho será carregado aqui</p>
            </div>
          </div>
        );

      case 'customer':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-base font-medium mb-2">Nome Completo</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Digite seu nome"
                />
              </div>
              <div>
                <label className="block text-base font-medium mb-2">E-mail</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="seu@email.com"
                />
              </div>
              <div>
                <label className="block text-base font-medium mb-2">Telefone</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>
          </div>
        );

      case 'shipping':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-base font-medium mb-2">Endereço</label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Rua, número, complemento"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-base font-medium mb-2">Cidade</label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="São Paulo"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium mb-2">Estado</label>
                  <Input
                    value={formData.state}
                    onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                    placeholder="SP"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium mb-2">CEP</label>
                  <Input
                    value={formData.zipCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
                    placeholder="01234-567"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'payment':
        return (
          <div className="space-y-4">
            <div className="text-center py-8">
              <CreditCard className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Forma de Pagamento</h3>
              <p className="text-gray-600">Escolha como deseja pagar</p>
            </div>
            <div className="space-y-3">
              {['Cartão de Crédito', 'PIX', 'Boleto Bancário'].map(method => (
                <div key={method} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{method}</span>
                    <Badge variant="outline">Recomendado</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'confirmation':
        return (
          <div className="space-y-4">
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Confirmação do Pedido</h3>
              <p className="text-gray-600">Revise todas as informações</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>R$ 299,90</span>
              </div>
              <div className="flex justify-between">
                <span>Frete:</span>
                <span>Grátis</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Total:</span>
                <span>R$ 299,90</span>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Step não encontrado</div>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header com steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={handleBackToCart}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Carrinho
          </Button>
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>

        {/* Progress bar */}
        <div className="flex items-center justify-between mb-4">
          {CHECKOUT_STEPS.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${index <= currentStepIndex 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-200 text-gray-500'
                  }
                `}>
                  {index < currentStepIndex ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    step.icon
                  )}
                </div>
                <div className="text-sm mt-2 text-center">
                  <div className="font-medium">{step.title}</div>
                  <div className="text-gray-500">{step.description}</div>
                </div>
              </div>
              {index < CHECKOUT_STEPS.length - 1 && (
                <div className={`
                  flex-1 h-0.5 mx-4
                  ${index < currentStepIndex ? 'bg-primary' : 'bg-gray-200'}
                `} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Conteúdo do step */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {CHECKOUT_STEPS[currentStepIndex]?.icon}
            {CHECKOUT_STEPS[currentStepIndex]?.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navegação */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={isFirstStep}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Anterior
        </Button>

        <Button
          onClick={handleNext}
          disabled={isLastStep}
        >
          {isLastStep ? 'Finalizar Compra' : (
            <>
              Próximo
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}; 