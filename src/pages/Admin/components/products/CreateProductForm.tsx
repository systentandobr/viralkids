import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { WizardProgress, WizardStep } from '@/components/shared/wizard/WizardProgress';
import { WizardNavigation } from '@/components/shared/wizard/WizardNavigation';
import { ProductService } from '@/services/products/productService';
import { CreateProductData } from '@/services/products/types';
import { Package, DollarSign, Image, Tag, CheckCircle2, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { CategoryService } from '@/services/products/categoryService';
import { ProductCategory } from '@/services/products/types';

// Schema de validação
const productSchema = z.object({
  // Step 1: Informações Básicas
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  description: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
  shortDescription: z.string().min(5, 'Descrição curta deve ter no mínimo 5 caracteres'),
  category: z.string().min(1, 'Categoria obrigatória'),
  subcategory: z.string().optional(),
  sku: z.string().min(1, 'SKU obrigatório'),

  // Step 2: Preços e Estoque
  price: z.number().min(0.01, 'Preço deve ser maior que zero'),
  originalPrice: z.number().optional(),
  stockQuantity: z.number().min(0, 'Estoque não pode ser negativo'),
  availability: z.enum(['in_stock', 'out_of_stock', 'pre_order']).default('in_stock'),

  // Step 3: Imagens
  images: z.array(z.string().url('URL inválida')).min(1, 'Adicione pelo menos uma imagem'),

  // Step 4: Características
  tags: z.array(z.string()).default([]),
  features: z.array(z.string()).default([]),
  specifications: z.record(z.string(), z.string()).default({}),

  // Step 5: Dimensões e Personalização
  weight: z.number().optional(),
  dimensions: z.object({
    length: z.number().min(0).optional(),
    width: z.number().min(0).optional(),
    height: z.number().min(0).optional(),
  }).optional(),
  isPersonalizable: z.boolean().default(false),
});

type ProductFormData = z.infer<typeof productSchema>;

const STEPS: WizardStep[] = [
  { id: 1, title: 'Informações Básicas', icon: Package },
  { id: 2, title: 'Preços e Estoque', icon: DollarSign },
  { id: 3, title: 'Imagens', icon: Image },
  { id: 4, title: 'Características', icon: Tag },
  { id: 5, title: 'Confirmação', icon: CheckCircle2 },
];

interface CreateProductFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateProductForm({ onSuccess, onCancel }: CreateProductFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');
  const { toast } = useToast();

  // Buscar categorias
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await CategoryService.list();
      return response.success && response.data ? response.data : [];
    },
  });

  const categories: ProductCategory[] = categoriesData || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      availability: 'in_stock',
      images: [],
      tags: [],
      features: [],
      specifications: {},
      isPersonalizable: false,
      stockQuantity: 0,
    },
  });

  const watchedValues = watch();
  const progress = (currentStep / STEPS.length) * 100;

  // Validação por step
  const validateStep = async (step: number): Promise<boolean> => {
    let fieldsToValidate: (keyof ProductFormData)[] = [];

    switch (step) {
      case 1:
        fieldsToValidate = ['name', 'description', 'shortDescription', 'category', 'sku'];
        break;
      case 2:
        fieldsToValidate = ['price', 'stockQuantity', 'availability'];
        break;
      case 3:
        fieldsToValidate = ['images'];
        break;
      case 4:
        return true; // Opcional
      case 5:
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

  const handleAddImage = () => {
    if (imageUrl.trim() && !watchedValues.images?.includes(imageUrl.trim())) {
      const newImages = [...(watchedValues.images || []), imageUrl.trim()];
      setValue('images', newImages);
      setImageUrl('');
    }
  };

  const handleRemoveImage = (urlToRemove: string) => {
    const newImages = watchedValues.images?.filter((url) => url !== urlToRemove) || [];
    setValue('images', newImages);
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

  const handleAddFeature = () => {
    if (featureInput.trim() && !watchedValues.features?.includes(featureInput.trim())) {
      const newFeatures = [...(watchedValues.features || []), featureInput.trim()];
      setValue('features', newFeatures);
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (featureToRemove: string) => {
    const newFeatures = watchedValues.features?.filter((f) => f !== featureToRemove) || [];
    setValue('features', newFeatures);
  };

  const handleAddSpecification = () => {
    if (specKey.trim() && specValue.trim()) {
      const newSpecs = {
        ...(watchedValues.specifications || {}),
        [specKey.trim()]: specValue.trim(),
      };
      setValue('specifications', newSpecs);
      setSpecKey('');
      setSpecValue('');
    }
  };

  const handleRemoveSpecification = (keyToRemove: string) => {
    const newSpecs = { ...(watchedValues.specifications || {}) };
    delete newSpecs[keyToRemove];
    setValue('specifications', newSpecs);
  };

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);

    try {
      const productData: CreateProductData = {
        name: data.name,
        description: data.description,
        shortDescription: data.shortDescription,
        category: data.category,
        subcategory: data.subcategory,
        sku: data.sku,
        price: data.price,
        originalPrice: data.originalPrice,
        images: data.images,
        tags: data.tags,
        features: data.features,
        specifications: data.specifications,
        availability: data.availability,
        stockQuantity: data.stockQuantity,
        weight: data.weight,
        dimensions: data.dimensions,
        isPersonalizable: data.isPersonalizable,
      };

      const response = await ProductService.createProduct(productData);

      if (!response.success) {
        throw new Error(response.error || 'Erro ao criar produto');
      }

      toast({
        title: '✅ Produto criado com sucesso!',
        description: `${data.name} foi cadastrado no sistema.`,
      });

      onSuccess?.();
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: '❌ Erro ao criar produto',
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
              <Label htmlFor='name'>Nome do Produto *</Label>
              <Input
                id='name'
                {...register('name')}
                placeholder='Ex: Cela Especial Dino K-ing'
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className='text-base text-destructive mt-1'>{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor='shortDescription'>Descrição Curta *</Label>
              <Input
                id='shortDescription'
                {...register('shortDescription')}
                placeholder='Breve descrição do produto'
                className={errors.shortDescription ? 'border-destructive' : ''}
              />
              {errors.shortDescription && (
                <p className='text-base text-destructive mt-1'>{errors.shortDescription.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor='description'>Descrição Completa *</Label>
              <Textarea
                id='description'
                {...register('description')}
                placeholder='Descrição detalhada do produto'
                rows={4}
                className={errors.description ? 'border-destructive' : ''}
              />
              {errors.description && (
                <p className='text-base text-destructive mt-1'>{errors.description.message}</p>
              )}
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='category'>Categoria *</Label>
                <Select
                  value={watchedValues.category || ''}
                  onValueChange={(value) => setValue('category', value)}
                >
                  <SelectTrigger id='category'>
                    <SelectValue placeholder='Selecione uma categoria' />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className='text-base text-destructive mt-1'>{errors.category.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor='subcategory'>Subcategoria</Label>
                <Input
                  id='subcategory'
                  {...register('subcategory')}
                  placeholder='Opcional'
                />
              </div>
            </div>

            <div>
              <Label htmlFor='sku'>SKU (Código do Produto) *</Label>
              <Input
                id='sku'
                {...register('sku')}
                placeholder='Ex: SKU-001'
                className={errors.sku ? 'border-destructive' : ''}
              />
              {errors.sku && (
                <p className='text-base text-destructive mt-1'>{errors.sku.message}</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='price'>Preço de Venda (R$) *</Label>
                <Input
                  id='price'
                  type='number'
                  step='0.01'
                  min='0'
                  {...register('price', { valueAsNumber: true })}
                  className={errors.price ? 'border-destructive' : ''}
                />
                {errors.price && (
                  <p className='text-base text-destructive mt-1'>{errors.price.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor='originalPrice'>Preço Original (R$)</Label>
                <Input
                  id='originalPrice'
                  type='number'
                  step='0.01'
                  min='0'
                  {...register('originalPrice', { valueAsNumber: true })}
                  placeholder='Opcional'
                />
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='stockQuantity'>Quantidade em Estoque *</Label>
                <Input
                  id='stockQuantity'
                  type='number'
                  min='0'
                  {...register('stockQuantity', { valueAsNumber: true })}
                  className={errors.stockQuantity ? 'border-destructive' : ''}
                />
                {errors.stockQuantity && (
                  <p className='text-base text-destructive mt-1'>{errors.stockQuantity.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor='availability'>Disponibilidade *</Label>
                <Select
                  value={watchedValues.availability}
                  onValueChange={(value: any) => setValue('availability', value)}
                >
                  <SelectTrigger id='availability'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='in_stock'>Em Estoque</SelectItem>
                    <SelectItem value='out_of_stock'>Sem Estoque</SelectItem>
                    <SelectItem value='pre_order'>Pré-venda</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className='space-y-4'>
            <div>
              <Label htmlFor='imageUrl'>URL da Imagem</Label>
              <div className='flex gap-2'>
                <Input
                  id='imageUrl'
                  type='url'
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddImage();
                    }
                  }}
                  placeholder='https://exemplo.com/imagem.jpg'
                />
                <Button type='button' onClick={handleAddImage}>
                  Adicionar
                </Button>
              </div>
            </div>

            {watchedValues.images && watchedValues.images.length > 0 && (
              <div className='space-y-2'>
                <Label>Imagens Adicionadas ({watchedValues.images.length})</Label>
                <div className='grid grid-cols-2 gap-2'>
                  {watchedValues.images.map((url, index) => (
                    <Card key={index}>
                      <CardContent className='pt-4'>
                        <div className='flex items-center justify-between'>
                          <div className='flex-1 min-w-0'>
                            <p className='text-sm truncate'>{url}</p>
                          </div>
                          <Button
                            type='button'
                            variant='ghost'
                            size='sm'
                            onClick={() => handleRemoveImage(url)}
                            className='ml-2 text-destructive hover:text-destructive'
                          >
                            <X className='w-4 h-4' />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {errors.images && (
              <p className='text-base text-destructive'>{errors.images.message}</p>
            )}
          </div>
        );

      case 4:
        return (
          <div className='space-y-6'>
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

            <div>
              <Label htmlFor='features'>Características</Label>
              <div className='flex gap-2 mb-2'>
                <Input
                  id='features'
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddFeature();
                    }
                  }}
                  placeholder='Digite uma característica e pressione Enter'
                />
                <Button type='button' onClick={handleAddFeature}>
                  Adicionar
                </Button>
              </div>
              {watchedValues.features && watchedValues.features.length > 0 && (
                <div className='flex flex-wrap gap-2'>
                  {watchedValues.features.map((feature) => (
                    <Badge key={feature} variant='secondary' className='flex items-center gap-1'>
                      {feature}
                      <button
                        type='button'
                        onClick={() => handleRemoveFeature(feature)}
                        className='ml-1 hover:text-destructive'
                      >
                        <X className='w-3 h-3' />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label>Especificações Técnicas</Label>
              <div className='grid grid-cols-2 gap-2 mb-2'>
                <Input
                  value={specKey}
                  onChange={(e) => setSpecKey(e.target.value)}
                  placeholder='Chave (ex: Material)'
                />
                <div className='flex gap-2'>
                  <Input
                    value={specValue}
                    onChange={(e) => setSpecValue(e.target.value)}
                    placeholder='Valor (ex: Plástico)'
                  />
                  <Button type='button' onClick={handleAddSpecification}>
                    Adicionar
                  </Button>
                </div>
              </div>
              {watchedValues.specifications &&
                Object.keys(watchedValues.specifications).length > 0 && (
                  <div className='space-y-2'>
                    {Object.entries(watchedValues.specifications).map(([key, value]) => (
                      <Card key={key}>
                        <CardContent className='pt-4'>
                          <div className='flex items-center justify-between'>
                            <div>
                              <span className='font-medium'>{key}:</span> {value}
                            </div>
                            <Button
                              type='button'
                              variant='ghost'
                              size='sm'
                              onClick={() => handleRemoveSpecification(key)}
                              className='text-destructive hover:text-destructive'
                            >
                              <X className='w-4 h-4' />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
            </div>

            <div className='flex items-center space-x-2 pt-4 border-t'>
              <Checkbox
                id='isPersonalizable'
                checked={watchedValues.isPersonalizable}
                onCheckedChange={(checked) => setValue('isPersonalizable', !!checked)}
              />
              <Label htmlFor='isPersonalizable' className='cursor-pointer'>
                Produto personalizável
              </Label>
            </div>
          </div>
        );

      case 5:
        return (
          <div className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Produto</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <h3 className='font-semibold mb-2'>Informações Básicas</h3>
                  <p className='text-muted-foreground'>
                    <strong>Nome:</strong> {watchedValues.name}
                  </p>
                  <p className='text-muted-foreground'>
                    <strong>SKU:</strong> {watchedValues.sku}
                  </p>
                  <p className='text-muted-foreground'>
                    <strong>Categoria:</strong>{' '}
                    {categories.find((c) => c.id === watchedValues.category)?.name || watchedValues.category}
                  </p>
                  {watchedValues.subcategory && (
                    <p className='text-muted-foreground'>
                      <strong>Subcategoria:</strong> {watchedValues.subcategory}
                    </p>
                  )}
                </div>

                <div>
                  <h3 className='font-semibold mb-2'>Preços e Estoque</h3>
                  <p className='text-muted-foreground'>
                    <strong>Preço:</strong> R$ {watchedValues.price?.toFixed(2) || '0.00'}
                  </p>
                  {watchedValues.originalPrice && (
                    <p className='text-muted-foreground'>
                      <strong>Preço Original:</strong> R$ {watchedValues.originalPrice.toFixed(2)}
                    </p>
                  )}
                  <p className='text-muted-foreground'>
                    <strong>Estoque:</strong> {watchedValues.stockQuantity || 0} unidades
                  </p>
                  <p className='text-muted-foreground'>
                    <strong>Disponibilidade:</strong>{' '}
                    {watchedValues.availability === 'in_stock'
                      ? 'Em Estoque'
                      : watchedValues.availability === 'out_of_stock'
                      ? 'Sem Estoque'
                      : 'Pré-venda'}
                  </p>
                </div>

                <div>
                  <h3 className='font-semibold mb-2'>Imagens ({watchedValues.images?.length || 0})</h3>
                  {watchedValues.images && watchedValues.images.length > 0 && (
                    <div className='space-y-1'>
                      {watchedValues.images.map((url, index) => (
                        <p key={index} className='text-sm text-muted-foreground truncate'>
                          {url}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                {(watchedValues.tags?.length || 0) > 0 && (
                  <div>
                    <h3 className='font-semibold mb-2'>Tags ({watchedValues.tags?.length || 0})</h3>
                    <div className='flex flex-wrap gap-2'>
                      {watchedValues.tags?.map((tag) => (
                        <Badge key={tag} variant='secondary'>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
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
        <CardTitle className='text-2xl'>Criar Novo Produto</CardTitle>
        <CardDescription>
          Complete as etapas abaixo para cadastrar um novo produto no sistema
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
            submitLabel='Criar Produto'
            canGoNext={true}
          />
        </form>
      </CardContent>
    </Card>
  );
}

