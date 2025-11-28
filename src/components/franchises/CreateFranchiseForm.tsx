import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import { GoogleMapsAutocomplete, AddressData } from './GoogleMapsAutocomplete';
import { MapView } from './MapView';
import { generateUnitId, validateUnitIdFormat } from '@/utils/unitIdGenerator';
import { generateTempPassword } from '@/utils/passwordGenerator';
import { UserService } from '@/services/users/userService';
import { notificationService } from '@/services/api/notifications.service';
import { franchisesService } from '@/services/api/franchises.service';
import { useAuthStore } from '@/stores/auth.store';
import { 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle, 
  Building2, 
  User, 
  MapPin, 
  Map as MapIcon,
  Loader2
} from 'lucide-react';
import { BRAZILIAN_STATES } from './BrazilianStatesSelect';

// Schema de validação
const franchiseSchema = z.object({
  // Step 1: Informações Básicas
  unitId: z.string().optional(),
  franchiseName: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  status: z.enum(['active', 'pending', 'inactive']),
  type: z.enum(['standard', 'premium', 'express']),

  // Step 2: Proprietário
  ownerName: z.string().min(3, 'Nome do proprietário obrigatório'),
  ownerEmail: z.string().email('Email inválido'),
  ownerPhone: z.string().optional(),

  // Step 3: Localização
  address: z.string().min(5, 'Endereço completo obrigatório'),
  city: z.string().min(2, 'Cidade obrigatória'),
  state: z.string().min(2, 'Estado obrigatório'),
  postalCode: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
  neighborhood: z.string().optional(),
  number: z.string().optional(),

  // Step 4: Território (Opcional)
  hasTerritory: z.boolean().default(false),
  territoryCity: z.string().optional(),
  territoryState: z.string().optional(),
  territoryRadius: z.string().optional(),
  territoryExclusive: z.boolean().default(false),
});

type FranchiseFormData = z.infer<typeof franchiseSchema>;

const STEPS = [
  { id: 1, title: 'Informações Básicas', icon: Building2 },
  { id: 2, title: 'Proprietário', icon: User },
  { id: 3, title: 'Localização', icon: MapPin },
  { id: 4, title: 'Território', icon: MapIcon },
];

interface CreateFranchiseFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateFranchiseForm({ onSuccess, onCancel }: CreateFranchiseFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressData, setAddressData] = useState<AddressData | null>(null);
  const { toast } = useToast();
  const { isLoaded: mapsLoaded, loadError: mapsError } = useGoogleMaps();
  const currentUser = useAuthStore(state => state.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<FranchiseFormData>({
    resolver: zodResolver(franchiseSchema),
    defaultValues: {
      status: 'pending',
      type: 'standard',
      hasTerritory: false,
      territoryExclusive: false,
      latitude: -23.5505,
      longitude: -46.6333,
    },
  });

  const watchedValues = watch();
  const progress = (currentStep / STEPS.length) * 100;

  // Validação por step
  const validateStep = async (step: number): Promise<boolean> => {
    let fieldsToValidate: (keyof FranchiseFormData)[] = [];

    switch (step) {
      case 1:
        fieldsToValidate = ['franchiseName', 'status', 'type'];
        break;
      case 2:
        fieldsToValidate = ['ownerName', 'ownerEmail'];
        break;
      case 3:
        fieldsToValidate = ['address', 'city', 'state', 'latitude', 'longitude'];
        break;
      case 4:
        if (watchedValues.hasTerritory) {
          fieldsToValidate = ['territoryCity', 'territoryState'];
        }
        break;
    }

    const result = await trigger(fieldsToValidate);
    return result;
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAddressSelect = (data: AddressData) => {
    setAddressData(data);
    setValue('address', data.fullAddress);
    setValue('city', data.city);
    setValue('state', data.state);
    setValue('postalCode', data.postalCode);
    setValue('latitude', data.latitude);
    setValue('longitude', data.longitude);
    setValue('neighborhood', data.neighborhood);
    setValue('number', data.number);

    // Gera unitId automaticamente se estiver vazio
    if (!watchedValues.unitId) {
      const generatedId = generateUnitId({
        country: data.country,
        state: data.state,
        city: data.city,
        neighborhood: data.neighborhood,
        number: data.number,
      });
      setValue('unitId', generatedId);
    }
  };

  const handleCoordinatesChange = (lat: number, lng: number) => {
    setValue('latitude', lat);
    setValue('longitude', lng);
  };

  const onSubmit = async (data: FranchiseFormData) => {
    setIsSubmitting(true);

    try {
      // 1. Obter domain do usuário logado
      const domain = currentUser?.domain || 'viralkids'; // fallback

      // 2. Preparar dados do proprietário
      const [firstName, ...lastNameParts] = data.ownerName.split(' ');
      const lastName = lastNameParts.join(' ') || firstName;

      // 3. Gerar username e password temporário
      const username = data.ownerEmail.split('@')[0]; // parte antes do @
      const tempPassword = generateTempPassword(12);

      // 4. Criar usuário franqueado
      // Nota: O backend cria o usuário com o domain do usuário logado automaticamente
      // O SYS-SEGURANÇA requer informações completas de endereço
      const userResponse = await UserService.create({
        email: data.ownerEmail,
        username: username,
        password: tempPassword,
        firstName,
        lastName,
        country: 'BR',
        state: data.state,
        zipCode: data.postalCode || '00000-000',
        localNumber: data.number || 'S/N',
        unitName: data.franchiseName,
        address: data.address,
        complement: 'N/A', // Campo obrigatório - usar valor padrão se não houver complemento
        neighborhood: data.neighborhood || data.city,
        city: data.city,
        latitude: data.latitude,
        longitude: data.longitude,
      });

      if (!userResponse.success || !userResponse.data) {
        throw new Error(userResponse.error || 'Erro ao criar usuário');
      }

      const createdUser = userResponse.data;

      // 5. Gerar unitId se não existir
      const unitId = data.unitId || generateUnitId({
        country: 'BR',
        state: data.state,
        city: data.city,
        neighborhood: data.neighborhood,
        number: data.number,
      });

      // 6. Preparar dados da franquia no formato esperado pela API
      const franchiseData = {
        unitId: unitId,
        name: data.franchiseName,
        ownerId: createdUser.id,
        ownerName: data.ownerName,
        ownerEmail: data.ownerEmail,
        ownerPhone: data.ownerPhone,
        location: {
          lat: data.latitude,
          lng: data.longitude,
          address: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.postalCode || '',
          type: 'physical' as const,
        },
        status: data.status as 'active' | 'inactive' | 'pending' | 'suspended',
        type: data.type as 'standard' | 'premium' | 'express',
        territory: data.hasTerritory && data.territoryCity && data.territoryState ? {
          city: data.territoryCity,
          state: data.territoryState,
          exclusive: data.territoryExclusive,
          radius: data.territoryRadius ? parseFloat(data.territoryRadius) : undefined,
        } : undefined,
      };

      // 7. Criar franquia na API
      const franchiseResponse = await franchisesService.createFranchise(franchiseData);

      // 8. Enviar notificação (não bloqueia o fluxo se falhar)
      try {
        const notificationResult = await notificationService.sendNotification({
          title: 'Nova Franquia Cadastrada',
          message: `A franquia ${data.franchiseName} foi cadastrada com sucesso. O proprietário ${data.ownerName} receberá um email de confirmação.`,
          type: 'success',
          metadata: {
            'ID da Franquia': franchiseResponse.unitId,
            'ID do Proprietário': createdUser.id,
            'Email': data.ownerEmail,
            'Nome': data.ownerName,
            'Status': data.status,
          },
        });

        if (!notificationResult.success) {
          console.warn('Notificação não foi enviada:', notificationResult.error);
        }
      } catch (notificationError) {
        // Não bloquear o fluxo se a notificação falhar
        console.warn('Erro ao enviar notificação:', notificationError);
      }

      toast({
        title: '✅ Franquia criada com sucesso!',
        description: `${data.franchiseName} foi cadastrada. Um email de ativação foi enviado para ${data.ownerEmail}.`,
      });

      onSuccess?.();
    } catch (error) {
      console.error('Error creating franchise:', error);
      toast({
        title: '❌ Erro ao criar franquia',
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
              <Label htmlFor='unitId'>Unit ID (Auto-gerado)</Label>
              <Input
                id='unitId'
                {...register('unitId')}
                placeholder='Será gerado automaticamente'
                disabled
              />
              <p className='text-xs text-muted-foreground mt-1'>
                Formato: #BR#UF#CIDADE#BAIRRO#NUMERO
              </p>
            </div>

            <div>
              <Label htmlFor='franchiseName'>Nome da Franquia *</Label>
              <Input
                id='franchiseName'
                {...register('franchiseName')}
                placeholder='Ex: Franquia Centro'
                className={errors.franchiseName ? 'border-destructive' : ''}
              />
              {errors.franchiseName && (
                <p className='text-sm text-destructive mt-1'>{errors.franchiseName.message}</p>
              )}
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='status'>Status</Label>
                <Select
                  value={watchedValues.status}
                  onValueChange={(value: any) => setValue('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='pending'>Pendente</SelectItem>
                    <SelectItem value='active'>Ativa</SelectItem>
                    <SelectItem value='inactive'>Inativa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor='type'>Tipo</Label>
                <Select
                  value={watchedValues.type}
                  onValueChange={(value: any) => setValue('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='standard'>Standard</SelectItem>
                    <SelectItem value='premium'>Premium</SelectItem>
                    <SelectItem value='express'>Express</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className='space-y-4'>
            <div>
              <Label htmlFor='ownerName'>Nome do Proprietário *</Label>
              <Input
                id='ownerName'
                {...register('ownerName')}
                placeholder='Ex: João Silva'
                className={errors.ownerName ? 'border-destructive' : ''}
              />
              {errors.ownerName && (
                <p className='text-sm text-destructive mt-1'>{errors.ownerName.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor='ownerEmail'>Email *</Label>
              <Input
                id='ownerEmail'
                type='email'
                {...register('ownerEmail')}
                placeholder='joao@example.com'
                className={errors.ownerEmail ? 'border-destructive' : ''}
              />
              {errors.ownerEmail && (
                <p className='text-sm text-destructive mt-1'>{errors.ownerEmail.message}</p>
              )}
              <p className='text-xs text-muted-foreground mt-1'>
                Um email de ativação será enviado para este endereço
              </p>
            </div>

            <div>
              <Label htmlFor='ownerPhone'>Telefone</Label>
              <Input
                id='ownerPhone'
                {...register('ownerPhone')}
                placeholder='(00) 00000-0000'
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className='space-y-6'>
            {mapsError && (
              <div className='p-4 bg-destructive/10 border border-destructive rounded-md'>
                <p className='text-sm text-destructive'>
                  ⚠️ Google Maps não disponível. Configure VITE_GOOGLE_MAPS_API_KEY no .env
                </p>
              </div>
            )}

            {mapsLoaded && (
              <>
                <GoogleMapsAutocomplete
                  onAddressSelect={handleAddressSelect}
                  defaultValue={watchedValues.address}
                  error={errors.address?.message}
                />

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label htmlFor='city'>Cidade *</Label>
                    <Input
                      id='city'
                      {...register('city')}
                      className={errors.city ? 'border-destructive' : ''}
                      readOnly
                    />
                  </div>

                  <div>
                    <Label htmlFor='state'>Estado *</Label>
                    <Input
                      id='state'
                      {...register('state')}
                      className={errors.state ? 'border-destructive' : ''}
                      readOnly
                    />
                  </div>
                </div>

                {addressData && (
                  <MapView
                    latitude={watchedValues.latitude}
                    longitude={watchedValues.longitude}
                    onCoordinatesChange={handleCoordinatesChange}
                    draggable
                  />
                )}
              </>
            )}

            {!mapsLoaded && !mapsError && (
              <div className='flex items-center justify-center h-40'>
                <Loader2 className='w-8 h-8 animate-spin text-primary' />
                <span className='ml-2'>Carregando Google Maps...</span>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className='space-y-6'>
            <div className='flex items-center space-x-2'>
              <Checkbox
                id='hasTerritory'
                checked={watchedValues.hasTerritory}
                onCheckedChange={(checked) => setValue('hasTerritory', !!checked)}
              />
              <Label htmlFor='hasTerritory' className='cursor-pointer'>
                Adicionar território à franquia
              </Label>
            </div>

            {watchedValues.hasTerritory && (
              <div className='space-y-4 p-4 border rounded-md bg-card'>
                <div className='grid grid-cols-2 gap-4'>

                <div>
                    <Label htmlFor='territoryState'>Estado</Label>
                    <Select
                      value={watchedValues.territoryState}
                      onValueChange={(value) => setValue('territoryState', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Selecione...' />
                      </SelectTrigger>
                      <SelectContent>
                        {BRAZILIAN_STATES.map((state) => (
                          <SelectItem key={state.value} value={state.value}>
                            {state.label}
                          </SelectItem>
                        ))}
                        {/* Adicionar mais estados */}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor='territoryCity'>Cidade do Território</Label>
                    <Input
                      id='territoryCity'
                      {...register('territoryCity')}
                      placeholder='Ex: São Paulo'
                    />
                  </div>

                  
                </div>

                <div>
                  <Label htmlFor='territoryRadius'>Raio (km)</Label>
                  <Input
                    id='territoryRadius'
                    {...register('territoryRadius')}
                    type='number'
                    placeholder='Ex: 10'
                  />
                </div>

                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='territoryExclusive'
                    checked={watchedValues.territoryExclusive}
                    onCheckedChange={(checked) => setValue('territoryExclusive', !!checked)}
                  />
                  <Label htmlFor='territoryExclusive' className='cursor-pointer'>
                    Território exclusivo
                  </Label>
                </div>
              </div>
            )}

            {!watchedValues.hasTerritory && (
              <div className='text-center py-8 text-muted-foreground'>
                <MapIcon className='w-12 h-12 mx-auto mb-2 opacity-50' />
                <p>Território opcional. Marque a opção acima para configurar.</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className='w-full max-w-4xl mx-auto'>
      <CardHeader>
        <CardTitle className='text-2xl'>Criar Nova Franquia</CardTitle>
        <CardDescription>
          Complete as etapas abaixo para cadastrar uma nova franquia no sistema
        </CardDescription>

        {/* Progress Bar */}
        <div className='space-y-2 pt-4'>
          <Progress value={progress} className='h-2' />
          <div className='flex justify-between text-xs text-muted-foreground'>
            {STEPS.map((step) => (
              <div
                key={step.id}
                className={`flex items-center gap-1 ${
                  currentStep >= step.id ? 'text-primary font-medium' : ''
                }`}
              >
                {currentStep > step.id ? (
                  <CheckCircle className='w-4 h-4 text-neon-green' />
                ) : (
                  <step.icon className='w-4 h-4' />
                )}
                <span className='hidden sm:inline'>{step.title}</span>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          {/* Step Badge */}
          <div className='flex items-center gap-2'>
            <Badge variant='outline' className='text-sm'>
              Etapa {currentStep} de {STEPS.length}
            </Badge>
            <span className='text-sm font-medium'>{STEPS[currentStep - 1].title}</span>
          </div>

          {/* Step Content */}
          <div className='min-h-[400px]'>{renderStepContent()}</div>

          {/* Navigation Buttons */}
          <div className='flex justify-between pt-4 border-t'>
            <Button
              type='button'
              variant='outline'
              onClick={currentStep === 1 ? onCancel : handlePrevious}
            >
              <ChevronLeft className='w-4 h-4 mr-2' />
              {currentStep === 1 ? 'Cancelar' : 'Anterior'}
            </Button>

            {currentStep < STEPS.length ? (
              <Button type='button' className='bg-primary text-white' onClick={handleNext}>
                Próximo
                <ChevronRight className='w-4 h-4 ml-2' />
              </Button>
            ) : (
              <Button type='submit' className='bg-primary text-white' disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                    Criando...
                  </>
                ) : (
                  <>
                    <CheckCircle className='w-4 h-4 mr-2' />
                    Criar Franquia
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
