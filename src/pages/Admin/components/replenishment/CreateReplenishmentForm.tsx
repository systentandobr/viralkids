import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { WizardProgress, WizardStep } from '@/components/shared/wizard/WizardProgress';
import { WizardNavigation } from '@/components/shared/wizard/WizardNavigation';
import { useReplenishmentPlan } from '@/features/inventory/hooks/useReplenishment';
import { ReplenishSuggestionLine } from '@/services/inventory/inventory.api';
import { useCreateOrder } from '@/services/queries/orders';
import { Package, Edit, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuthContext } from '@/features/auth';

// Schema de validação
const replenishmentSchema = z.object({
  // Step 1: Sugestões (geradas automaticamente)
  suggestions: z.array(
    z.object({
      productId: z.string(),
      sku: z.string(),
      suggestedQty: z.number().min(0),
      adjustedQty: z.number().min(0).optional(),
      reason: z.enum(['below_safety', 'projected_demand', 'stockout_risk']),
    })
  ).min(1, 'Nenhuma sugestão disponível'),

  // Step 2: Observações
  notes: z.string().optional(),
});

type ReplenishmentFormData = z.infer<typeof replenishmentSchema>;

const STEPS: WizardStep[] = [
  { id: 1, title: 'Revisar Sugestões', icon: Package },
  { id: 2, title: 'Ajustar Quantidades', icon: Edit },
  { id: 3, title: 'Confirmação', icon: CheckCircle2 },
];

interface CreateReplenishmentFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateReplenishmentForm({ onSuccess, onCancel }: CreateReplenishmentFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuthContext();
  const { isLoading: planLoading, error: planError, plan, generate } = useReplenishmentPlan();
  const createOrder = useCreateOrder();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<ReplenishmentFormData>({
    resolver: zodResolver(replenishmentSchema),
    defaultValues: {
      suggestions: [],
      notes: '',
    },
  });

  const watchedValues = watch();

  // Gerar plano ao montar o componente
  useEffect(() => {
    if (!plan && !planLoading && !planError) {
      generate();
    }
  }, []);

  // Atualizar sugestões quando o plano for gerado
  useEffect(() => {
    if (plan?.suggestions) {
      const suggestions = plan.suggestions.map((s) => ({
        ...s,
        adjustedQty: s.suggestedQty,
      }));
      setValue('suggestions', suggestions);
      trigger('suggestions');
    }
  }, [plan, setValue, trigger]);

  // Validação por step
  const validateStep = async (step: number): Promise<boolean> => {
    switch (step) {
      case 1:
        // Verificar se há sugestões
        return watchedValues.suggestions?.length > 0;
      case 2:
        // Verificar se há pelo menos um item com quantidade > 0
        return (
          watchedValues.suggestions?.some(
            (s: any) => (s.adjustedQty ?? s.suggestedQty) > 0
          ) ?? false
        );
      case 3:
        return true;
      default:
        return true;
    }
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    } else if (!isValid) {
      toast({
        title: 'Validação',
        description: 'Por favor, revise as informações antes de continuar.',
        variant: 'destructive',
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleQuantityChange = (index: number, value: number) => {
    const suggestions = [...(watchedValues.suggestions || [])];
    suggestions[index] = {
      ...suggestions[index],
      adjustedQty: Math.max(0, value),
    };
    setValue('suggestions', suggestions);
    trigger('suggestions');
  };

  const getReasonLabel = (reason: string) => {
    switch (reason) {
      case 'below_safety':
        return 'Estoque abaixo do mínimo';
      case 'projected_demand':
        return 'Demanda projetada';
      case 'stockout_risk':
        return 'Risco de falta';
      default:
        return reason;
    }
  };

  const getReasonColor = (reason: string) => {
    switch (reason) {
      case 'below_safety':
        return 'bg-yellow-100 text-yellow-800';
      case 'projected_demand':
        return 'bg-blue-100 text-blue-800';
      case 'stockout_risk':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const onSubmit = async (data: ReplenishmentFormData) => {
    setIsSubmitting(true);

    try {
      // Filtrar apenas itens com quantidade > 0
      const itemsToOrder = data.suggestions
        .filter((s) => (s.adjustedQty ?? s.suggestedQty) > 0)
        .map((s) => ({
          productId: s.productId,
          productName: `SKU ${s.sku}`, // TODO: Buscar nome real do produto
          quantity: s.adjustedQty ?? s.suggestedQty,
          price: 0, // TODO: Buscar preço real do produto
          total: 0, // TODO: Calcular total real
        }));

      if (itemsToOrder.length === 0) {
        toast({
          title: 'Atenção',
          description: 'Selecione pelo menos um item para reposição.',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }

      // Criar pedido de reposição
      // Nota: Usando o endpoint de pedidos normal, mas pode ser adaptado para um endpoint específico de reposição
      const orderData = {
        customerId: '', // Pedido interno de reposição
        customerName: `Reposição - ${user?.name || 'Unidade'}`,
        customerEmail: user?.email || '',
        items: itemsToOrder,
        total: itemsToOrder.reduce((sum, item) => sum + item.total, 0),
        status: 'processando' as const,
        shippingAddress: undefined, // Reposição não precisa de endereço de entrega
      };

      await createOrder.mutateAsync(orderData);

      toast({
        title: '✅ Pedido de reposição criado com sucesso!',
        description: `${itemsToOrder.length} item(ns) adicionado(s) ao pedido de reposição.`,
      });

      onSuccess?.();
    } catch (error) {
      console.error('Error creating replenishment order:', error);
      toast({
        title: '❌ Erro ao criar pedido de reposição',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Sugestões de Reposição</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Baseado no estoque atual e demanda projetada, o sistema sugeriu os seguintes itens para reposição:
              </p>
            </div>

            {planLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="text-center space-y-2">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-sm text-muted-foreground">Gerando plano de reposição...</p>
                </div>
              </div>
            )}

            {planError && (
              <Card className="border-destructive">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 text-destructive">
                    <AlertCircle className="h-5 w-5" />
                    <p className="text-sm">{planError}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {plan && watchedValues.suggestions && watchedValues.suggestions.length > 0 && (
              <div className="space-y-3">
                {watchedValues.suggestions.map((suggestion: any, index: number) => (
                  <Card key={`${suggestion.productId}-${suggestion.sku}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-medium">SKU: {suggestion.sku}</span>
                            <Badge className={getReasonColor(suggestion.reason)}>
                              {getReasonLabel(suggestion.reason)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Quantidade sugerida: <span className="font-semibold">{suggestion.suggestedQty}</span>
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {plan && (!watchedValues.suggestions || watchedValues.suggestions.length === 0) && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhuma sugestão disponível</h3>
                  <p className="text-sm text-muted-foreground">
                    Seu estoque está adequado. Não há necessidade de reposição no momento.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Ajustar Quantidades</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Revise e ajuste as quantidades sugeridas conforme necessário:
              </p>
            </div>

            {watchedValues.suggestions && watchedValues.suggestions.length > 0 && (
              <div className="space-y-3">
                {watchedValues.suggestions.map((suggestion: any, index: number) => {
                  const adjustedQty = suggestion.adjustedQty ?? suggestion.suggestedQty;
                  return (
                    <Card key={`${suggestion.productId}-${suggestion.sku}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-medium">SKU: {suggestion.sku}</span>
                              <Badge variant="outline" className="text-xs">
                                Sugerido: {suggestion.suggestedQty}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {getReasonLabel(suggestion.reason)}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Label htmlFor={`qty-${index}`} className="text-sm whitespace-nowrap">
                              Quantidade:
                            </Label>
                            <Input
                              id={`qty-${index}`}
                              type="number"
                              min="0"
                              value={adjustedQty}
                              onChange={(e) =>
                                handleQuantityChange(index, parseInt(e.target.value) || 0)
                              }
                              className="w-24"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        );

      case 3:
        const itemsToConfirm = watchedValues.suggestions?.filter(
          (s: any) => (s.adjustedQty ?? s.suggestedQty) > 0
        ) || [];

        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Confirmação</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Revise os itens selecionados antes de confirmar o pedido de reposição:
              </p>
            </div>

            {itemsToConfirm.length > 0 ? (
              <div className="space-y-3">
                {itemsToConfirm.map((suggestion: any) => (
                  <Card key={`${suggestion.productId}-${suggestion.sku}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">SKU: {suggestion.sku}</span>
                          <p className="text-sm text-muted-foreground">
                            Quantidade: <span className="font-semibold">
                              {suggestion.adjustedQty ?? suggestion.suggestedQty}
                            </span>
                          </p>
                        </div>
                        <Badge className={getReasonColor(suggestion.reason)}>
                          {getReasonLabel(suggestion.reason)}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhum item selecionado</h3>
                  <p className="text-sm text-muted-foreground">
                    Volte e selecione pelo menos um item para reposição.
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="pt-4">
              <Label htmlFor="notes" className="text-sm font-medium">
                Observações (opcional)
              </Label>
              <textarea
                id="notes"
                {...register('notes')}
                className="mt-2 w-full min-h-[100px] p-3 border rounded-md resize-none"
                placeholder="Adicione observações sobre este pedido de reposição..."
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Criar Pedido de Reposição</CardTitle>
        <CardDescription>
          Complete as etapas abaixo para criar um pedido de reposição baseado nas sugestões do sistema
        </CardDescription>

        <WizardProgress steps={STEPS} currentStep={currentStep} />
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="min-h-[400px]">{renderStepContent()}</div>

          <WizardNavigation
            currentStep={currentStep}
            totalSteps={STEPS.length}
            stepTitle={STEPS[currentStep - 1].title}
            onPrevious={handlePrevious}
            onCancel={onCancel}
            onNext={handleNext}
            onSubmit={handleSubmit(onSubmit)}
            isSubmitting={isSubmitting}
            submitLabel="Criar Pedido de Reposição"
            canGoNext={true}
          />
        </form>
      </CardContent>
    </Card>
  );
}

