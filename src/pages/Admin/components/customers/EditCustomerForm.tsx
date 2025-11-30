import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { WizardProgress, WizardStep } from '@/components/shared/wizard/WizardProgress';
import { WizardNavigation } from '@/components/shared/wizard/WizardNavigation';
import { useUpdateCustomer, useCustomer } from '@/services/queries/customers';
import { User, TrendingUp, CheckCircle2 } from 'lucide-react';
import { Loader2 } from 'lucide-react';

// Schema de validação
const customerSchema = z.object({
  // Step 1: Informações Básicas
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone inválido').optional(),

  // Step 2: Status e Histórico
  status: z.enum(['vip', 'ativo', 'novo']).optional(),
  totalPurchases: z.number().min(0).optional(),
  totalSpent: z.number().min(0).optional(),
  isActive: z.boolean().optional(),
});

type CustomerFormData = z.infer<typeof customerSchema>;

const STEPS: WizardStep[] = [
  { id: 1, title: 'Informações Básicas', icon: User },
  { id: 2, title: 'Status e Histórico', icon: TrendingUp },
  { id: 3, title: 'Confirmação', icon: CheckCircle2 },
];

interface EditCustomerFormProps {
  customerId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function EditCustomerForm({ customerId, onSuccess, onCancel }: EditCustomerFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const updateCustomer = useUpdateCustomer();
  const { data: customer, isLoading } = useCustomer(customerId);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      status: 'novo',
      totalPurchases: 0,
      totalSpent: 0,
      isActive: true,
    },
  });

  useEffect(() => {
    if (customer) {
      setValue('name', customer.name);
      setValue('email', customer.email);
      setValue('phone', customer.phone);
      setValue('status', customer.status);
      setValue('totalPurchases', customer.totalPurchases);
      setValue('totalSpent', customer.totalSpent);
      setValue('isActive', customer.isActive);
    }
  }, [customer, setValue]);

  const watchedValues = watch();
  const progress = (currentStep / STEPS.length) * 100;

  // Validação por step
  const validateStep = async (step: number): Promise<boolean> => {
    let fieldsToValidate: (keyof CustomerFormData)[] = [];

    switch (step) {
      case 1:
        fieldsToValidate = ['name', 'email'];
        break;
      case 2:
        return true;
      case 3:
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

  const onSubmit = async (data: CustomerFormData) => {
    setIsSubmitting(true);

    try {
      await updateCustomer.mutateAsync({
        id: customerId,
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          status: data.status,
          totalPurchases: data.totalPurchases,
          totalSpent: data.totalSpent,
          isActive: data.isActive,
        },
      });

      toast({
        title: '✅ Cliente atualizado com sucesso!',
        description: `Dados de ${data.name} foram atualizados.`,
      });

      onSuccess?.();
    } catch (error) {
      console.error('Error updating customer:', error);
      toast({
        title: '❌ Erro ao atualizar cliente',
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
          <div className='space-y-4'>
            <div>
              <Label htmlFor='name'>Nome Completo *</Label>
              <Input
                id='name'
                {...register('name')}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className='text-base text-destructive mt-1'>{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor='email'>Email *</Label>
              <Input
                id='email'
                type='email'
                {...register('email')}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className='text-base text-destructive mt-1'>{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor='phone'>Telefone</Label>
              <Input
                id='phone'
                {...register('phone')}
                className={errors.phone ? 'border-destructive' : ''}
              />
              {errors.phone && (
                <p className='text-base text-destructive mt-1'>{errors.phone.message}</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className='space-y-4'>
            <div>
              <Label htmlFor='status'>Status</Label>
              <Select
                value={watchedValues.status || ''}
                onValueChange={(value: any) => {
                  setValue('status', value, { shouldValidate: true, shouldDirty: true });
                }}
              >
                <SelectTrigger id='status'>
                  <SelectValue placeholder='Selecione o status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='novo'>Novo</SelectItem>
                  <SelectItem value='ativo'>Ativo</SelectItem>
                  <SelectItem value='vip'>VIP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor='totalPurchases'>Total de Compras</Label>
              <Input
                id='totalPurchases'
                type='number'
                min='0'
                {...register('totalPurchases', { valueAsNumber: true })}
              />
            </div>

            <div>
              <Label htmlFor='totalSpent'>Total Gasto (R$)</Label>
              <Input
                id='totalSpent'
                type='number'
                min='0'
                step='0.01'
                {...register('totalSpent', { valueAsNumber: true })}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Resumo das Alterações</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <h3 className='font-semibold mb-2'>Informações Básicas</h3>
                  <p className='text-muted-foreground'>{watchedValues.name}</p>
                  <p className='text-muted-foreground'>{watchedValues.email}</p>
                  {watchedValues.phone && (
                    <p className='text-muted-foreground'>{watchedValues.phone}</p>
                  )}
                </div>

                <div>
                  <h3 className='font-semibold mb-2'>Status e Histórico</h3>
                  <p className='text-muted-foreground'>
                    Status: {watchedValues.status === 'vip' ? 'VIP' : watchedValues.status === 'ativo' ? 'Ativo' : 'Novo'}
                  </p>
                  <p className='text-muted-foreground'>
                    Total de Compras: {watchedValues.totalPurchases || 0}
                  </p>
                  <p className='text-muted-foreground'>
                    Total Gasto: R$ {(watchedValues.totalSpent || 0).toFixed(2)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className='pt-6'>
          <div className='flex items-center justify-center h-40'>
            <Loader2 className='w-8 h-8 animate-spin text-primary' />
            <span className='ml-2'>Carregando cliente...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!customer) {
    return (
      <Card>
        <CardContent className='pt-6'>
          <p className='text-destructive'>Cliente não encontrado</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='w-full max-w-4xl mx-auto'>
      <CardHeader>
        <CardTitle className='text-2xl'>Editar Cliente</CardTitle>
        <CardDescription>
          Complete as etapas abaixo para atualizar os dados do cliente
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
            submitLabel='Salvar Alterações'
            canGoNext={true}
          />
        </form>
      </CardContent>
    </Card>
  );
}

