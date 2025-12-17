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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { WizardProgress, WizardStep } from '@/components/shared/wizard/WizardProgress';
import { WizardNavigation } from '@/components/shared/wizard/WizardNavigation';
import { useUpdateLead, useLead } from '@/services/queries/leads';
import { LeadSource } from '@/services/leads/leadService';
import { User, Tag, CheckCircle2, X } from 'lucide-react';
import { Loader2 } from 'lucide-react';

// Schema de validação
const leadSchema = z.object({
  // Step 1: Informações de Contato
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  city: z.string().optional(),
  state: z.string().optional(),

  // Step 2: Origem e Classificação
  source: z.nativeEnum(LeadSource).optional(),
  tags: z.array(z.string()).default([]),
  score: z.number().min(0).max(100).optional(),
});

type LeadFormData = z.infer<typeof leadSchema>;

const STEPS: WizardStep[] = [
  { id: 1, title: 'Informações de Contato', icon: User },
  { id: 2, title: 'Origem e Classificação', icon: Tag },
  { id: 3, title: 'Confirmação', icon: CheckCircle2 },
];

const LEAD_SOURCES = [
  { value: LeadSource.CHATBOT, label: 'Chatbot' },
  { value: LeadSource.WEBSITE, label: 'Website' },
  { value: LeadSource.WHATSAPP, label: 'WhatsApp' },
  { value: LeadSource.FORM, label: 'Formulário' },
  { value: LeadSource.LANDING_PAGE, label: 'Indicação' },
];

interface EditLeadFormProps {
  leadId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function EditLeadForm({ leadId, onSuccess, onCancel }: EditLeadFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const { toast } = useToast();
  const updateLead = useUpdateLead();
  const { data: lead, isLoading } = useLead(leadId);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      tags: [],
      score: 0,
    },
  });

  useEffect(() => {
    if (lead) {
      setValue('name', lead.name);
      setValue('email', lead.email);
      setValue('phone', lead.phone);
      setValue('city', lead.city);
      setValue('state', lead.state);
      setValue('source', lead.source);
      setValue('tags', lead.tags || []);
      setValue('score', lead.score);
    }
  }, [lead, setValue]);

  const watchedValues = watch();
  const progress = (currentStep / STEPS.length) * 100;

  // Validação por step
  const validateStep = async (step: number): Promise<boolean> => {
    let fieldsToValidate: (keyof LeadFormData)[] = [];

    switch (step) {
      case 1:
        fieldsToValidate = ['name', 'email', 'phone'];
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

  const handleAddTag = () => {
    if (tagInput.trim() && !watchedValues.tags?.includes(tagInput.trim())) {
      const newTags = [...(watchedValues.tags || []), tagInput.trim()];
      setValue('tags', newTags);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = watchedValues.tags?.filter((tag) => tag !== tagToRemove) || [];
    setValue('tags', newTags);
  };

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);

    try {
      await updateLead.mutateAsync({
        id: leadId,
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          city: data.city,
          state: data.state,
          source: data.source,
          tags: data.tags,
          score: data.score,
        },
      });

      toast({
        title: '✅ Lead atualizado com sucesso!',
        description: `Dados de ${data.name} foram atualizados.`,
      });

      onSuccess?.();
    } catch (error) {
      console.error('Error updating lead:', error);
      toast({
        title: '❌ Erro ao atualizar lead',
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
              <Label htmlFor='phone'>Telefone *</Label>
              <Input
                id='phone'
                {...register('phone')}
                className={errors.phone ? 'border-destructive' : ''}
              />
              {errors.phone && (
                <p className='text-base text-destructive mt-1'>{errors.phone.message}</p>
              )}
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='city'>Cidade</Label>
                <Input id='city' {...register('city')} />
              </div>

              <div>
                <Label htmlFor='state'>Estado</Label>
                <Input id='state' {...register('state')} />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className='space-y-4'>
            <div>
              <Label htmlFor='source'>Origem do Lead</Label>
              <Select
                value={watchedValues.source || ''}
                onValueChange={(value) => {
                  setValue('source', value as LeadSource, { shouldValidate: true, shouldDirty: true });
                }}
              >
                <SelectTrigger id='source'>
                  <SelectValue placeholder='Selecione a origem' />
                </SelectTrigger>
                <SelectContent>
                  {LEAD_SOURCES.map((source) => (
                    <SelectItem key={source.value} value={source.value}>
                      {source.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor='score'>Score (0-100)</Label>
              <Input
                id='score'
                type='number'
                min='0'
                max='100'
                {...register('score', { valueAsNumber: true })}
              />
            </div>

            <div>
              <Label htmlFor='tags'>Tags</Label>
              <div className='flex gap-2 mb-2'>
                <Input
                  id='tags'
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder='Digite uma tag e pressione Enter'
                />
                <Button type='button' onClick={handleAddTag}>
                  Adicionar
                </Button>
              </div>
              {watchedValues.tags && watchedValues.tags.length > 0 && (
                <div className='flex flex-wrap gap-2'>
                  {watchedValues.tags.map((tag) => (
                    <Badge key={tag} variant='secondary' className='flex items-center gap-1'>
                      {tag}
                      <button
                        type='button'
                        onClick={() => handleRemoveTag(tag)}
                        className='ml-1 hover:text-destructive'
                      >
                        <X className='w-3 h-3' />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
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
                  <h3 className='font-semibold mb-2'>Informações de Contato</h3>
                  <p className='text-muted-foreground'>{watchedValues.name}</p>
                  <p className='text-muted-foreground'>{watchedValues.email}</p>
                  <p className='text-muted-foreground'>{watchedValues.phone}</p>
                  {(watchedValues.city || watchedValues.state) && (
                    <p className='text-muted-foreground'>
                      {watchedValues.city}, {watchedValues.state}
                    </p>
                  )}
                </div>

                <div>
                  <h3 className='font-semibold mb-2'>Origem e Classificação</h3>
                  {watchedValues.source && (
                    <p className='text-muted-foreground'>
                      Origem:{' '}
                      {LEAD_SOURCES.find((s) => s.value === watchedValues.source)?.label}
                    </p>
                  )}
                  {watchedValues.score !== undefined && (
                    <p className='text-muted-foreground'>Score: {watchedValues.score}</p>
                  )}
                  {watchedValues.tags && watchedValues.tags.length > 0 && (
                    <div className='flex flex-wrap gap-2 mt-2'>
                      {watchedValues.tags.map((tag) => (
                        <Badge key={tag} variant='secondary'>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
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
            <span className='ml-2'>Carregando lead...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!lead) {
    return (
      <Card>
        <CardContent className='pt-6'>
          <p className='text-destructive'>Lead não encontrado</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='w-full max-w-4xl mx-auto'>
      <CardHeader>
        <CardTitle className='text-2xl'>Editar Lead</CardTitle>
        <CardDescription>
          Complete as etapas abaixo para atualizar os dados do lead
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

