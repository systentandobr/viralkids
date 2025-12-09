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
import { useToast } from '@/hooks/use-toast';
import { WizardProgress, WizardStep } from '@/components/shared/wizard/WizardProgress';
import { WizardNavigation } from '@/components/shared/wizard/WizardNavigation';
import { UserService } from '@/services/users/userService';
import { User, MapPin, Building, CheckCircle2, Shield, Key } from 'lucide-react';
import { BRAZILIAN_STATES } from '@/components/franchises/BrazilianStatesSelect';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import { GoogleMapsAutocomplete, AddressData } from '@/components/franchises/GoogleMapsAutocomplete';
import { MapView } from '@/components/franchises/MapView';
import { Loader2 } from 'lucide-react';
import { RolesService, Role, Permission } from '@/services/users/rolesService';
import { useAuthContext } from '@/features/auth';
import { isAdminRole, ROLE_CATEGORIES } from '@/features/auth/utils/roleUtils';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

// Schema de validação seguindo CreateUserDto do backend
const userSchema = z.object({
  // Step 1: Informações Básicas
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
  username: z.string().min(3, 'Username deve ter pelo menos 3 caracteres'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
  firstName: z.string().min(2, 'Primeiro nome deve ter pelo menos 2 caracteres'),
  lastName: z.string().min(2, 'Sobrenome deve ter pelo menos 2 caracteres'),

  // Step 2: Endereço
  country: z.string().min(1, 'País é obrigatório'),
  state: z.string().min(2, 'Estado é obrigatório'),
  city: z.string().min(2, 'Cidade é obrigatória'),
  zipCode: z.string().min(8, 'CEP inválido'),
  address: z.string().min(5, 'Endereço é obrigatório'),
  complement: z.string().min(1, 'Complemento é obrigatório'),
  neighborhood: z.string().min(2, 'Bairro é obrigatório'),
  localNumber: z.string().min(1, 'Número é obrigatório'),
  latitude: z.number().min(-90).max(90, 'Latitude inválida'),
  longitude: z.number().min(-180).max(180, 'Longitude inválida'),

  // Step 3: Unidade
  unitName: z.string().min(2, 'Nome da unidade é obrigatório'),
  unitId: z.string().optional(),

  // Step 4: Roles e Permissões (opcional, apenas para admins/gerentes)
  selectedRoles: z.array(z.string()).optional(),
  selectedPermissions: z.array(z.string()).optional(),
});

type UserFormData = z.infer<typeof userSchema>;

// Steps serão definidos dinamicamente baseado no role do usuário
const BASE_STEPS: WizardStep[] = [
  { id: 1, title: 'Informações Básicas', icon: User },
  { id: 2, title: 'Endereço', icon: MapPin },
  { id: 3, title: 'Unidade', icon: Building },
];

interface CreateUserFormProps {
  unitId?: string;
  unitName?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateUserForm({ unitId, unitName, onSuccess, onCancel }: CreateUserFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressData, setAddressData] = useState<AddressData | null>(null);
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [availablePermissions, setAvailablePermissions] = useState<Permission[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const { toast } = useToast();
  const { isLoaded: mapsLoaded, loadError: mapsError } = useGoogleMaps();
  const { user: currentUser } = useAuthContext();

  // Verificar se o usuário pode definir roles e permissões
  const canManageRoles = currentUser && (isAdminRole(currentUser.role) || currentUser.role === 'gerente');

  // Definir steps dinamicamente
  const STEPS: WizardStep[] = [
    ...BASE_STEPS,
    ...(canManageRoles ? [{ id: 4, title: 'Roles e Permissões', icon: Shield }] : []),
    { id: canManageRoles ? 5 : 4, title: 'Confirmação', icon: CheckCircle2 },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      country: 'BR',
      unitId: unitId,
      unitName: unitName || '',
      selectedRoles: [],
      selectedPermissions: [],
    },
  });

  // Carregar roles e permissões disponíveis
  useEffect(() => {
    if (canManageRoles) {
      loadRolesAndPermissions();
    }
  }, [canManageRoles]);

  const loadRolesAndPermissions = async () => {
    setIsLoadingRoles(true);
    try {
      const [rolesResponse, permissionsResponse] = await Promise.all([
        RolesService.getAvailableRoles(),
        RolesService.getAvailablePermissions(),
      ]);

      if (rolesResponse.success && rolesResponse.data) {
        setAvailableRoles(rolesResponse.data);
      }

      if (permissionsResponse.success && permissionsResponse.data) {
        setAvailablePermissions(permissionsResponse.data);
      }
    } catch (error) {
      console.error('Erro ao carregar roles e permissões:', error);
      toast({
        title: 'Aviso',
        description: 'Não foi possível carregar roles e permissões. Usando valores padrão.',
        variant: 'default',
      });
    } finally {
      setIsLoadingRoles(false);
    }
  };

  const watchedValues = watch();

  const handleAddressSelect = (data: AddressData) => {
    setAddressData(data);
    setValue('address', data.fullAddress || data.street || '');
    setValue('city', data.city || '');
    setValue('state', data.state || '');
    setValue('zipCode', data.postalCode || '');
    setValue('latitude', data.latitude);
    setValue('longitude', data.longitude);
    setValue('neighborhood', data.neighborhood || '');
    setValue('localNumber', data.number || '');
  };

  const handleCoordinatesChange = (lat: number, lng: number) => {
    setValue('latitude', lat, { shouldValidate: true });
    setValue('longitude', lng, { shouldValidate: true });
  };

  // Validação por step
  const validateStep = async (step: number): Promise<boolean> => {
    let fieldsToValidate: (keyof UserFormData)[] = [];

    switch (step) {
      case 1:
        fieldsToValidate = ['email', 'username', 'password', 'firstName', 'lastName'];
        break;
      case 2:
        fieldsToValidate = [
          'country',
          'state',
          'city',
          'zipCode',
          'address',
          'complement',
          'neighborhood',
          'localNumber',
          'latitude',
          'longitude',
        ];
        break;
      case 3:
        fieldsToValidate = ['unitName'];
        break;
      case 4:
        // Step de roles e permissões (opcional)
        if (canManageRoles) {
          // Validação opcional para roles e permissões
          return true;
        }
        // Se não tem permissão, pula para confirmação
        return true;
      case 5:
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

  const onSubmit = async (data: UserFormData) => {
    setIsSubmitting(true);

    try {
      // Preparar dados para criação - remover campos não permitidos no DTO
      const createData = {
        email: data.email,
        username: data.username,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        country: data.country,
        state: data.state,
        zipCode: data.zipCode,
        localNumber: data.localNumber,
        unitName: data.unitName,
        address: data.address,
        complement: data.complement,
        neighborhood: data.neighborhood,
        city: data.city,
        latitude: data.latitude,
        longitude: data.longitude,
        unitId: data.unitId,
      };

      const response = await UserService.create(createData);

      if (response.success) {
        toast({
          title: '✅ Usuário criado com sucesso!',
          description: `${data.firstName} ${data.lastName} foi cadastrado no sistema.`,
        });
        onSuccess?.();
      } else {
        throw new Error(response.error || 'Erro ao criar usuário');
      }
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast({
        title: '❌ Erro ao criar usuário',
        description: error?.message || 'Erro desconhecido',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContentForStep = (step: number) => {
    // Step de confirmação (último step)
    return (
      <div className="space-y-4">
        <div className="p-4 border rounded-lg bg-muted/50">
          <h4 className="font-semibold mb-3">Informações Básicas</h4>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Nome:</span> {watchedValues.firstName}{' '}
              {watchedValues.lastName}
            </p>
            <p>
              <span className="font-medium">Email:</span> {watchedValues.email}
            </p>
            <p>
              <span className="font-medium">Username:</span> {watchedValues.username}
            </p>
          </div>
        </div>

        <div className="p-4 border rounded-lg bg-muted/50">
          <h4 className="font-semibold mb-3">Endereço</h4>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Endereço:</span> {watchedValues.address},{' '}
              {watchedValues.localNumber}
            </p>
            <p>
              <span className="font-medium">Complemento:</span> {watchedValues.complement}
            </p>
            <p>
              <span className="font-medium">Bairro:</span> {watchedValues.neighborhood}
            </p>
            <p>
              <span className="font-medium">Cidade:</span> {watchedValues.city} -{' '}
              {watchedValues.state}
            </p>
            <p>
              <span className="font-medium">CEP:</span> {watchedValues.zipCode}
            </p>
            <p>
              <span className="font-medium">Coordenadas:</span> Lat:{' '}
              {watchedValues.latitude?.toFixed(6)}, Lng:{' '}
              {watchedValues.longitude?.toFixed(6)}
            </p>
          </div>
        </div>

        <div className="p-4 border rounded-lg bg-muted/50">
          <h4 className="font-semibold mb-3">Unidade</h4>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Nome da Unidade:</span> {watchedValues.unitName}
            </p>
            {watchedValues.unitId && (
              <p>
                <span className="font-medium">Unit ID:</span> {watchedValues.unitId}
              </p>
            )}
          </div>
        </div>

        {canManageRoles && watchedValues.selectedRoles && watchedValues.selectedRoles.length > 0 && (
          <div className="p-4 border rounded-lg bg-muted/50">
            <h4 className="font-semibold mb-3">Roles Selecionados</h4>
            <div className="flex flex-wrap gap-2">
              {watchedValues.selectedRoles.map((roleName) => {
                const role = availableRoles.find((r) => r.name === roleName);
                return (
                  <Badge key={roleName} variant="secondary">
                    {role?.displayName || roleName}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        {canManageRoles &&
          watchedValues.selectedPermissions &&
          watchedValues.selectedPermissions.length > 0 && (
            <div className="p-4 border rounded-lg bg-muted/50">
              <h4 className="font-semibold mb-3">Permissões Selecionadas</h4>
              <div className="space-y-1">
                {watchedValues.selectedPermissions.map((permName) => {
                  const perm = availablePermissions.find((p) => p.name === permName);
                  return (
                    <div key={permName} className="text-sm">
                      • {perm?.description || permName}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="email@exemplo.com"
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                {...register('username')}
                placeholder="usuario123"
                className={errors.username ? 'border-destructive' : ''}
              />
              {errors.username && (
                <p className="text-sm text-destructive mt-1">{errors.username.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Senha *</Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                placeholder="Mínimo 8 caracteres"
                className={errors.password ? 'border-destructive' : ''}
              />
              {errors.password && (
                <p className="text-sm text-destructive mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Primeiro Nome *</Label>
                <Input
                  id="firstName"
                  {...register('firstName')}
                  placeholder="João"
                  className={errors.firstName ? 'border-destructive' : ''}
                />
                {errors.firstName && (
                  <p className="text-sm text-destructive mt-1">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="lastName">Sobrenome *</Label>
                <Input
                  id="lastName"
                  {...register('lastName')}
                  placeholder="Silva"
                  className={errors.lastName ? 'border-destructive' : ''}
                />
                {errors.lastName && (
                  <p className="text-sm text-destructive mt-1">{errors.lastName.message}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            {mapsError && (
              <div className="p-4 bg-destructive/10 border border-destructive rounded-md">
                <p className="text-sm text-destructive">
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="country">País *</Label>
                    <Input
                      id="country"
                      {...register('country')}
                      value="BR"
                      readOnly
                      className={errors.country ? 'border-destructive' : ''}
                    />
                    {errors.country && (
                      <p className="text-sm text-destructive mt-1">{errors.country.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="state">Estado *</Label>
                    <Select
                      value={watchedValues.state}
                      onValueChange={(value) => {
                        setValue('state', value, { shouldValidate: true });
                      }}
                    >
                      <SelectTrigger id="state" className={errors.state ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Selecione o estado" />
                      </SelectTrigger>
                      <SelectContent>
                        {BRAZILIAN_STATES.map((state) => (
                          <SelectItem key={state.value} value={state.value}>
                            {state.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.state && (
                      <p className="text-sm text-destructive mt-1">{errors.state.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">Cidade *</Label>
                    <Input
                      id="city"
                      {...register('city')}
                      className={errors.city ? 'border-destructive' : ''}
                      readOnly={!!addressData}
                      value={watchedValues.city || ''}
                    />
                    {errors.city && (
                      <p className="text-sm text-destructive mt-1">{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="zipCode">CEP *</Label>
                    <Input
                      id="zipCode"
                      {...register('zipCode')}
                      placeholder="00000-000"
                      className={errors.zipCode ? 'border-destructive' : ''}
                      readOnly={!!addressData}
                      value={watchedValues.zipCode || ''}
                    />
                    {errors.zipCode && (
                      <p className="text-sm text-destructive mt-1">{errors.zipCode.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Endereço *</Label>
                  <Input
                    id="address"
                    {...register('address')}
                    placeholder="Rua, Avenida, etc."
                    className={errors.address ? 'border-destructive' : ''}
                    readOnly={!!addressData}
                    value={watchedValues.address || ''}
                  />
                  {errors.address && (
                    <p className="text-sm text-destructive mt-1">{errors.address.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="neighborhood">Bairro *</Label>
                    <Input
                      id="neighborhood"
                      {...register('neighborhood')}
                      placeholder="Bairro"
                      className={errors.neighborhood ? 'border-destructive' : ''}
                      readOnly={!!addressData}
                      value={watchedValues.neighborhood || ''}
                    />
                    {errors.neighborhood && (
                      <p className="text-sm text-destructive mt-1">{errors.neighborhood.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="localNumber">Número *</Label>
                    <Input
                      id="localNumber"
                      {...register('localNumber')}
                      placeholder="123"
                      className={errors.localNumber ? 'border-destructive' : ''}
                      readOnly={!!addressData?.number}
                      value={watchedValues.localNumber || ''}
                    />
                    {errors.localNumber && (
                      <p className="text-sm text-destructive mt-1">{errors.localNumber.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="complement">Complemento *</Label>
                  <Input
                    id="complement"
                    {...register('complement')}
                    placeholder="Apto, Bloco, etc."
                    className={errors.complement ? 'border-destructive' : ''}
                  />
                  {errors.complement && (
                    <p className="text-sm text-destructive mt-1">{errors.complement.message}</p>
                  )}
                </div>

                <div>
                  <Label>Coordenadas (Latitude, Longitude) *</Label>
                  {addressData ? (
                    <>
                      <MapView
                        latitude={watchedValues.latitude || addressData.latitude}
                        longitude={watchedValues.longitude || addressData.longitude}
                        onCoordinatesChange={handleCoordinatesChange}
                        draggable
                      />
                      <div className="mt-2 text-sm text-muted-foreground">
                        Lat: {watchedValues.latitude?.toFixed(6) || '0'}, Lng:{' '}
                        {watchedValues.longitude?.toFixed(6) || '0'}
                      </div>
                    </>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Input
                          type="number"
                          step="any"
                          {...register('latitude', { valueAsNumber: true })}
                          placeholder="Latitude (ex: -5.7793)"
                          className={errors.latitude ? 'border-destructive' : ''}
                        />
                        {errors.latitude && (
                          <p className="text-sm text-destructive mt-1">{errors.latitude.message}</p>
                        )}
                      </div>
                      <div>
                        <Input
                          type="number"
                          step="any"
                          {...register('longitude', { valueAsNumber: true })}
                          placeholder="Longitude (ex: -35.2009)"
                          className={errors.longitude ? 'border-destructive' : ''}
                        />
                        {errors.longitude && (
                          <p className="text-sm text-destructive mt-1">{errors.longitude.message}</p>
                        )}
                      </div>
                    </div>
                  )}
                  {errors.latitude && !addressData && (
                    <p className="text-sm text-destructive mt-1">{errors.latitude.message}</p>
                  )}
                  {errors.longitude && !addressData && (
                    <p className="text-sm text-destructive mt-1">{errors.longitude.message}</p>
                  )}
                </div>
              </>
            )}

            {!mapsLoaded && !mapsError && (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-2">Carregando Google Maps...</span>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="unitName">Nome da Unidade/Unidade *</Label>
              <Input
                id="unitName"
                {...register('unitName')}
                placeholder="Ex: Unidade Centro"
                className={errors.unitName ? 'border-destructive' : ''}
              />
              {errors.unitName && (
                <p className="text-sm text-destructive mt-1">{errors.unitName.message}</p>
              )}
            </div>

            {unitId && (
              <div>
                <Label htmlFor="unitId">Unit ID</Label>
                <Input
                  id="unitId"
                  {...register('unitId')}
                  value={unitId}
                  readOnly
                  className="bg-muted"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Este campo será preenchido automaticamente
                </p>
              </div>
            )}
          </div>
        );

      case 4:
        // Step de Roles e Permissões (apenas para admins/gerentes)
        if (!canManageRoles) {
          // Se não tem permissão, mostrar confirmação (step 4 quando não há step de roles)
          return renderStepContentForStep(4);
        }

        return (
          <div className="space-y-6">
            {isLoadingRoles ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-2">Carregando roles e permissões...</span>
              </div>
            ) : (
              <>
                {/* Seleção de Roles */}
                <div className="space-y-4">
                  <div>
                    <Label>Roles *</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Selecione um ou mais roles para o usuário
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto border rounded-lg p-4">
                      {availableRoles
                        .filter(
                          (role) =>
                            !ROLE_CATEGORIES.ADMIN.includes(role.name) ||
                            currentUser?.role === 'admin' ||
                            currentUser?.role === 'system'
                        )
                        .map((role) => {
                          const isSelected =
                            watchedValues.selectedRoles?.includes(role.name) || false;
                          return (
                            <div
                              key={role.id}
                              className={`flex items-start space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${isSelected
                                  ? 'border-primary bg-primary/5'
                                  : 'border-muted hover:border-primary/50'
                                }`}
                              onClick={async () => {
                                const currentRoles = watchedValues.selectedRoles || [];
                                const currentPermissions = watchedValues.selectedPermissions || [];

                                if (isSelected) {
                                  // Remover role
                                  const newRoles = currentRoles.filter((r) => r !== role.name);
                                  setValue('selectedRoles', newRoles, { shouldValidate: true });

                                  // Remover permissões que não pertencem a outros roles selecionados
                                  if (newRoles.length > 0) {
                                    const remainingRolePromises = newRoles.map((roleName) => {
                                      const r = availableRoles.find((r) => r.name === roleName);
                                      if (r && r.permissions && r.permissions.length > 0) {
                                        return Promise.resolve(r.permissions.map((p) => p.name));
                                      }
                                      return RolesService.getRoleById(roleName).then((response) => {
                                        if (response.success && response.data?.permissions) {
                                          return response.data.permissions.map((p) => p.name);
                                        }
                                        return [];
                                      });
                                    });

                                    const remainingPermissionsArrays = await Promise.all(remainingRolePromises);
                                    const remainingPermissionsSet = new Set<string>();
                                    remainingPermissionsArrays.forEach((perms) => {
                                      perms.forEach((perm) => remainingPermissionsSet.add(perm));
                                    });

                                    const newPermissions = currentPermissions.filter((perm) =>
                                      remainingPermissionsSet.has(perm)
                                    );
                                    setValue('selectedPermissions', newPermissions, { shouldValidate: true });
                                  } else {
                                    setValue('selectedPermissions', [], { shouldValidate: true });
                                  }
                                } else {
                                  // Adicionar role
                                  const newRoles = [...currentRoles, role.name];
                                  setValue('selectedRoles', newRoles, { shouldValidate: true });

                                  // Buscar e adicionar permissões do role
                                  const roleResponse = await RolesService.getRoleById(role.id);
                                  if (roleResponse.success && roleResponse.data?.permissions) {
                                    const rolePermissions = roleResponse.data.permissions.map((p) => p.name);
                                    const newPermissionsSet = new Set(currentPermissions);
                                    rolePermissions.forEach((perm) => newPermissionsSet.add(perm));
                                    setValue('selectedPermissions', Array.from(newPermissionsSet), { shouldValidate: true });
                                  }
                                }
                              }}
                            >
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={async (checked) => {
                                  const currentRoles = watchedValues.selectedRoles || [];
                                  const currentPermissions = watchedValues.selectedPermissions || [];

                                  if (checked) {
                                    // Adicionar role
                                    const newRoles = [...currentRoles, role.name];
                                    setValue('selectedRoles', newRoles, { shouldValidate: true });

                                    // Buscar e adicionar permissões do role
                                    const roleResponse = await RolesService.getRoleById(role.id);
                                    if (roleResponse.success && roleResponse.data?.permissions) {
                                      const rolePermissions = roleResponse.data.permissions.map((p) => p.name);
                                      const newPermissionsSet = new Set(currentPermissions);
                                      rolePermissions.forEach((perm) => newPermissionsSet.add(perm));
                                      setValue('selectedPermissions', Array.from(newPermissionsSet), { shouldValidate: true });
                                    }
                                  } else {
                                    // Remover role
                                    const newRoles = currentRoles.filter((r) => r !== role.name);
                                    setValue('selectedRoles', newRoles, { shouldValidate: true });

                                    // Remover permissões que não pertencem a outros roles selecionados
                                    if (newRoles.length > 0) {
                                      const remainingRolePromises = newRoles.map((roleName) => {
                                        const r = availableRoles.find((r) => r.name === roleName);
                                        if (r && r.permissions && r.permissions.length > 0) {
                                          return Promise.resolve(r.permissions.map((p) => p.name));
                                        }
                                        return RolesService.getRoleById(roleName).then((response) => {
                                          if (response.success && response.data?.permissions) {
                                            return response.data.permissions.map((p) => p.name);
                                          }
                                          return [];
                                        });
                                      });

                                      const remainingPermissionsArrays = await Promise.all(remainingRolePromises);
                                      const remainingPermissionsSet = new Set<string>();
                                      remainingPermissionsArrays.forEach((perms) => {
                                        perms.forEach((perm) => remainingPermissionsSet.add(perm));
                                      });

                                      const newPermissions = currentPermissions.filter((perm) =>
                                        remainingPermissionsSet.has(perm)
                                      );
                                      setValue('selectedPermissions', newPermissions, { shouldValidate: true });
                                    } else {
                                      setValue('selectedPermissions', [], { shouldValidate: true });
                                    }
                                  }
                                }}
                              />
                              <div className="flex-1">
                                <div className="font-medium">{role.displayName}</div>
                                <div className="text-sm text-muted-foreground">
                                  {role.description}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                    {watchedValues.selectedRoles &&
                      watchedValues.selectedRoles.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {watchedValues.selectedRoles.map((roleName) => {
                            const role = availableRoles.find((r) => r.name === roleName);
                            return (
                              <Badge key={roleName} variant="secondary">
                                {role?.displayName || roleName}
                              </Badge>
                            );
                          })}
                        </div>
                      )}
                  </div>

                  {/* Seleção de Permissões */}
                  <div className="space-y-4">
                    <div>
                      <Label>Permissões</Label>
                      <p className="text-sm text-muted-foreground mb-3">
                        Selecione permissões específicas (opcional). As permissões do role
                        selecionado serão aplicadas automaticamente.
                      </p>
                      <div className="space-y-2 max-h-64 overflow-y-auto border rounded-lg p-4">
                        {Object.entries(
                          availablePermissions.reduce(
                            (acc, perm) => {
                              if (!acc[perm.resource]) {
                                acc[perm.resource] = [];
                              }
                              acc[perm.resource].push(perm);
                              return acc;
                            },
                            {} as Record<string, Permission[]>
                          )
                        ).map(([resource, perms]) => (
                          <div key={resource} className="space-y-2">
                            <div className="font-medium text-sm capitalize">{resource}</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-4">
                              {perms.map((perm) => {
                                const isSelected =
                                  watchedValues.selectedPermissions?.includes(perm.name) || false;
                                return (
                                  <div key={perm.id} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`perm-${perm.id}`}
                                      checked={isSelected}
                                      onCheckedChange={(checked) => {
                                        const currentPerms =
                                          watchedValues.selectedPermissions || [];
                                        const newPerms = checked
                                          ? [...currentPerms, perm.name]
                                          : currentPerms.filter((p) => p !== perm.name);
                                        setValue('selectedPermissions', newPerms, {
                                          shouldValidate: true,
                                        });
                                      }}
                                    />
                                    <Label
                                      htmlFor={`perm-${perm.id}`}
                                      className="text-sm cursor-pointer"
                                    >
                                      {perm.description}
                                    </Label>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        );

      case 5:
        // Step de confirmação quando há step de roles (canManageRoles = true)
        if (canManageRoles) {
          return renderStepContentForStep(5);
        }
        // Se não tem permissão, não deveria chegar aqui
        return null;

      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <WizardProgress steps={STEPS} currentStep={currentStep} />

      <div className="mt-6">
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
            submitLabel="Criar Usuário"
            canGoNext={true}
          />
        </form>
      </div>
    </div>
  );
}

