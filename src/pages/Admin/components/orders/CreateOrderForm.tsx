import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { WizardProgress, WizardStep } from '@/components/shared/wizard/WizardProgress';
import { WizardNavigation } from '@/components/shared/wizard/WizardNavigation';
import { AddressStep } from '@/components/shared/wizard/AddressStep';
import { CustomerSelector } from './CustomerSelector';
import { OrderItemSelector, OrderItem } from './OrderItemSelector';
import { useCreateOrder } from '@/services/queries/orders';
import { ShoppingCart, User, MapPin, CheckCircle2 } from 'lucide-react';

// Schema de validação
const orderSchema = z.object({
  // Step 1: Cliente
  customerId: z.string().optional(),
  customerName: z.string().min(2, 'Nome do cliente obrigatório'),
  customerEmail: z.string().email('Email inválido'),
  customerPhone: z.string().optional(),

  // Step 2: Itens (validado no componente)
  items: z.array(
    z.object({
      productId: z.string(),
      productName: z.string(),
      quantity: z.number().min(1),
      price: z.number().min(0),
      total: z.number().min(0),
    })
  ).min(1, 'Adicione pelo menos um item ao pedido'),

  // Step 3: Endereço
  address: z.string().min(5, 'Endereço completo obrigatório'),
  street: z.string().min(2, 'Rua obrigatória'),
  city: z.string().min(2, 'Cidade obrigatória'),
  state: z.string().min(2, 'Estado obrigatório'),
  postalCode: z.string().optional(),
  neighborhood: z.string().min(2, 'Bairro obrigatório'),
  number: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
  complement: z.string().optional(),

  // Step 4: Status
  status: z.enum(['processando', 'enviado', 'entregue', 'cancelado']).default('processando'),
});

type OrderFormData = z.infer<typeof orderSchema>;

const STEPS: WizardStep[] = [
  { id: 1, title: 'Cliente', icon: User },
  { id: 2, title: 'Itens', icon: ShoppingCart },
  { id: 3, title: 'Endereço', icon: MapPin },
  { id: 4, title: 'Confirmação', icon: CheckCircle2 },
];

interface CreateOrderFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateOrderForm({ onSuccess, onCancel }: CreateOrderFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const createOrder = useCreateOrder();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      status: 'processando',
      items: [],
      latitude: -23.5505,
      longitude: -46.6333,
    },
  });

  const watchedValues = watch();
  const progress = (currentStep / STEPS.length) * 100;

  // Validação por step
  const validateStep = async (step: number): Promise<boolean> => {
    let fieldsToValidate: (keyof OrderFormData)[] = [];

    switch (step) {
      case 1:
        fieldsToValidate = ['customerName', 'customerEmail'];
        break;
      case 2:
        fieldsToValidate = ['items'];
        break;
      case 3:
        fieldsToValidate = ['address', 'street', 'city', 'state', 'neighborhood', 'latitude', 'longitude'];
        break;
      case 4:
        // Última etapa - valida tudo
        return true;
    }

    const result = await trigger(fieldsToValidate);
    return result;
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    } else if (!isValid) {
      toast({
        title: 'Validação',
        description: 'Por favor, preencha todos os campos obrigatórios antes de continuar.',
        variant: 'destructive',
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCustomerChange = (customer: {
    customerId?: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
  }) => {
    setValue('customerId', customer.customerId);
    setValue('customerName', customer.customerName);
    setValue('customerEmail', customer.customerEmail);
    setValue('customerPhone', customer.customerPhone);
  };

  const handleItemsChange = (items: OrderItem[]) => {
    setValue('items', items);
    // Revalidar campo items
    trigger('items');
  };

  const onSubmit = async (data: OrderFormData) => {
    setIsSubmitting(true);

    try {
      const orderData = {
        customerId: data.customerId || '',
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        items: data.items,
        total: data.items.reduce((sum, item) => sum + item.total, 0),
        status: data.status,
        shippingAddress: {
          street: data.street,
          number: data.number || 'S/N',
          complement: data.complement,
          neighborhood: data.neighborhood,
          city: data.city,
          state: data.state,
          zipCode: data.postalCode || '',
        },
      };

      await createOrder.mutateAsync(orderData);

      toast({
        title: '✅ Pedido criado com sucesso!',
        description: `Pedido criado para ${data.customerName}. Total: R$ ${orderData.total.toFixed(2)}`,
      });

      onSuccess?.();
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: '❌ Erro ao criar pedido',
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
          <CustomerSelector
            customerId={watchedValues.customerId}
            customerName={watchedValues.customerName}
            customerEmail={watchedValues.customerEmail}
            customerPhone={watchedValues.customerPhone}
            onCustomerChange={handleCustomerChange}
          />
        );

      case 2:
        return (
          <OrderItemSelector
            items={watchedValues.items || []}
            onItemsChange={handleItemsChange}
          />
        );

      case 3:
        return (
          <AddressStep
            register={register}
            setValue={setValue}
            errors={errors}
            watchedValues={{
              address: watchedValues.address,
              city: watchedValues.city,
              state: watchedValues.state,
              latitude: watchedValues.latitude,
              longitude: watchedValues.longitude,
              postalCode: watchedValues.postalCode,
              neighborhood: watchedValues.neighborhood,
              number: watchedValues.number,
              complement: watchedValues.complement,
            }}
            addressLabel='Endereço de Entrega'
            addressPlaceholder='Digite o endereço de entrega...'
          />
        );

      case 4:
        const total = watchedValues.items?.reduce((sum, item) => sum + item.total, 0) || 0;
        return (
          <div className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <h3 className='font-semibold mb-2'>Cliente</h3>
                  <p className='text-muted-foreground'>{watchedValues.customerName}</p>
                  <p className='text-muted-foreground'>{watchedValues.customerEmail}</p>
                  {watchedValues.customerPhone && (
                    <p className='text-muted-foreground'>{watchedValues.customerPhone}</p>
                  )}
                </div>

                <div>
                  <h3 className='font-semibold mb-2'>Itens ({watchedValues.items?.length || 0})</h3>
                  <div className='space-y-2'>
                    {watchedValues.items?.map((item, index) => (
                      <div key={index} className='flex justify-between text-sm'>
                        <span>
                          {item.productName} x {item.quantity}
                        </span>
                        <span>R$ {item.total.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className='font-semibold mb-2'>Endereço de Entrega</h3>
                  <p className='text-muted-foreground'>
                    {watchedValues.address}, {watchedValues.number || 'S/N'}
                    {watchedValues.complement && ` - ${watchedValues.complement}`}
                  </p>
                  <p className='text-muted-foreground'>
                    {watchedValues.neighborhood}, {watchedValues.city} - {watchedValues.state}
                  </p>
                  {watchedValues.postalCode && (
                    <p className='text-muted-foreground'>CEP: {watchedValues.postalCode}</p>
                  )}
                </div>

                <div className='pt-4 border-t'>
                  <div className='flex justify-between items-center'>
                    <span className='text-lg font-semibold'>Total:</span>
                    <span className='text-2xl font-bold text-primary'>R$ {total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className='w-full max-w-4xl mx-auto'>
      <CardHeader>
        <CardTitle className='text-2xl'>Criar Novo Pedido</CardTitle>
        <CardDescription>
          Complete as etapas abaixo para criar um novo pedido
        </CardDescription>

        <WizardProgress steps={STEPS} currentStep={currentStep} />
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div className='min-h-[400px]'>{renderStepContent()}</div>

          <WizardNavigation
            currentStep={currentStep}
            totalSteps={STEPS.length}
            stepTitle={STEPS[currentStep - 1].title}
            onPrevious={handlePrevious}
            onCancel={onCancel}
            onNext={handleNext}
            onSubmit={handleSubmit(onSubmit)}
            isSubmitting={isSubmitting}
            submitLabel='Criar Pedido'
            canGoNext={true}
          />
        </form>
      </CardContent>
    </Card>
  );
}

