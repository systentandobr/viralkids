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
import { CategorySelector } from './CategorySelector';
import { useQuery } from '@tanstack/react-query';
import { CategoryService } from '@/services/products/categoryService';
import { ProductCategory } from '@/services/products/types';
import { useSuppliers } from '@/features/suppliers/hooks/useSuppliers';
import { ImageUploadWithPaste } from '@/components/products/ImageUploadWithPaste';
import { useAuthContext } from '@/features/auth';

// Schema de validação
const productSchema = z.object({
  // Step 1: Informações Básicas
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  description: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
  shortDescription: z.string().min(5, 'Descrição curta deve ter no mínimo 5 caracteres'),
  category: z.string().min(1, 'Categoria obrigatória'),
  subcategory: z.string().optional(),
  sku: z.string().min(1, 'SKU obrigatório'),
  supplierId: z.string().min(1, 'Fornecedor obrigatório'),

  // Step 2: Preços e Estoque
  price: z.number().min(0.01, 'Preço deve ser maior que zero'),
  originalPrice: z.number().optional(),
  stockQuantity: z.number().min(0, 'Estoque não pode ser negativo'),
  availability: z.enum(['in_stock', 'out_of_stock', 'pre_order']).default('in_stock'),

  // Step 3: Imagens (validação será feita no submit, não aqui para permitir adicionar sem upload)
  images: z.array(z.object({ hashId: z.string() })).optional(),

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
  const [uploadingImages, setUploadingImages] = useState<Set<string>>(new Set());
  const [imageFiles, setImageFiles] = useState<Map<string, File>>(new Map()); // Armazenar arquivos em memória
  const [tagInput, setTagInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');
  const { toast } = useToast();
  const { suppliers } = useSuppliers();
  const { user } = useAuthContext();

  // Buscar categorias para exibição no resumo
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
    formState: { errors, ...formState },
    setValue,
    watch,
    trigger,
    getValues,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      category: '',
      supplierId: '',
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
        fieldsToValidate = ['name', 'description', 'shortDescription', 'category', 'sku', 'supplierId'];
        break;
      case 2:
        fieldsToValidate = ['price', 'stockQuantity', 'availability'];
        break;
      case 3:
        // Validar se há arquivos selecionados antes de avançar
        if (!imageFiles || imageFiles.size === 0) {
          return false;
        }
        return true;
      case 4:
        return true; // Opcional
      case 5:
        // Validar se há imagens antes de submeter
        if (!imageFiles || imageFiles.size === 0) {
          toast({
            title: 'Validação',
            description: 'Por favor, adicione pelo menos uma imagem antes de criar o produto.',
            variant: 'destructive',
          });
          return false;
        }
        return true;
    }

    console.log('[CreateProductForm] validateStep:', {
      step,
      fieldsToValidate,
      currentValues: getValues(),
      categoryValue: getValues('category'),
      categoryError: errors.category,
      allErrors: errors,
    });

    const result = await trigger(fieldsToValidate);
    
    console.log('[CreateProductForm] Validation result:', {
      step,
      isValid: result,
      errors: errors,
      categoryError: errors.category,
      categoryValue: getValues('category'),
      categoryWatched: watchedValues.category,
    });

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

  const handleFileSelect = async (file: File): Promise<void> => {
    // Armazenar arquivo em memória (não fazer upload ainda)
    const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setImageFiles((prev) => new Map(prev).set(fileId, file));
    
    // Adicionar placeholder ao array de imagens (será substituído após upload)
    const newImages = [...(watchedValues.images || []), { hashId: fileId, isPending: true }];
    setValue('images', newImages);
    
    toast({
      title: '✅ Imagem adicionada',
      description: 'A imagem será enviada após criar o produto.',
    });
  };

  const handleRemoveImage = (hashIdToRemove: string) => {
    // Remover do array de imagens
    const newImages = watchedValues.images?.filter((img) => {
      if (typeof img === 'object') {
        const imgHashId = (img as any).hashId;
        return imgHashId !== hashIdToRemove;
      }
      return true;
    }) || [];
    setValue('images', newImages);
    
    // Remover arquivo da memória se existir
    setImageFiles((prev) => {
      const next = new Map(prev);
      next.delete(hashIdToRemove);
      return next;
    });
  };

  const uploadImagesAfterProductCreation = async (productId: string) => {
    const uploadPromises: Promise<string>[] = [];
    const uploadedHashes: string[] = [];

    for (const [fileId, file] of imageFiles.entries()) {
      const uploadPromise = ProductService.uploadProductImage(file, productId)
        .then((response) => {
          if (response.success && response.data) {
            const hashId = response.data.hashId;
            uploadedHashes.push(hashId);
            return hashId;
          } else {
            throw new Error(response.error || 'Erro ao fazer upload da imagem');
          }
        })
        .catch((error) => {
          console.error(`Erro ao fazer upload da imagem ${fileId}:`, error);
          throw error;
        });

      uploadPromises.push(uploadPromise);
    }

    const results = await Promise.all(uploadPromises);
    
    // Atualizar o array de imagens substituindo os fileIds pelos hashIds reais
    const currentImages = watchedValues.images || [];
    const updatedImages = currentImages.map((img) => {
      if (typeof img === 'object') {
        const imgHashId = (img as any).hashId;
        // Se for um fileId pendente, substituir pelo hashId correspondente
        if ((img as any).isPending && imageFiles.has(imgHashId)) {
          const index = Array.from(imageFiles.keys()).indexOf(imgHashId);
          if (index >= 0 && results[index]) {
            return { hashId: results[index] };
          }
        }
        // Se já for um hashId válido, manter
        return img;
      }
      return img;
    }).filter((img) => typeof img === 'object' && (img as any).hashId && !(img as any).isPending);
    
    setValue('images', updatedImages);
    return uploadedHashes;
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

  const handleCategoryChange = (category: {
    categoryId: string;
    categoryName: string;
  }) => {
    setValue('category', category.categoryId, { 
      shouldValidate: true, 
      shouldDirty: true 
    });
    trigger('category');
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
        images: data.images.map((img) => 
          typeof img === 'object' && img.hashId ? { hashId: img.hashId } : { hashId: '' }
        ).filter((img) => img.hashId),
        tags: data.tags,
        features: data.features,
        specifications: data.specifications,
        availability: data.availability,
        stockQuantity: data.stockQuantity,
        weight: data.weight,
        dimensions: data.dimensions && data.dimensions.length && data.dimensions.width && data.dimensions.height
          ? {
              length: data.dimensions.length,
              width: data.dimensions.width,
              height: data.dimensions.height,
            }
          : undefined,
        isPersonalizable: data.isPersonalizable,
        supplierId: data.supplierId,
      };

      // Criar produto primeiro (sem imagens ainda)
      const productDataWithoutImages: CreateProductData = {
        ...productData,
        images: [], // Não enviar imagens ainda
      };

      const response = await ProductService.createProduct(productDataWithoutImages);

      if (!response.success) {
        throw new Error(response.error || 'Erro ao criar produto');
      }

      // Extrair productId da resposta
      const responseData = response.data as any;
      const product = responseData?.product || responseData;
      const productId = product?._id?.toString() || 
                        product?.id?.toString() || 
                        responseData?._id?.toString();
      
      if (!productId) {
        throw new Error('Não foi possível obter o ID do produto criado');
      }

      // Agora fazer upload das imagens com o productId
      if (imageFiles.size > 0) {
        try {
          setUploadingImages(new Set(Array.from(imageFiles.keys())));
          await uploadImagesAfterProductCreation(productId);
          
          toast({
            title: '✅ Produto e imagens criados com sucesso!',
            description: `${data.name} foi cadastrado no sistema com ${imageFiles.size} imagem(ns).`,
          });
        } catch (error: any) {
          console.error('Erro ao fazer upload das imagens:', error);
          toast({
            title: '⚠️ Produto criado, mas houve erro ao fazer upload das imagens',
            description: 'O produto foi criado com sucesso, mas algumas imagens não puderam ser enviadas. Você pode adicioná-las depois.',
            variant: 'default',
          });
        } finally {
          setUploadingImages(new Set());
        }
      } else {
        toast({
          title: '✅ Produto criado com sucesso!',
          description: `${data.name} foi cadastrado no sistema.`,
        });
      }

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
                <CategorySelector
                  categoryId={watchedValues.category}
                  categoryName={
                    watchedValues.category
                      ? // Buscar nome da categoria se necessário (opcional, pois o CategorySelector já mostra)
                        undefined
                      : undefined
                  }
                  onCategoryChange={handleCategoryChange}
                />
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
              <Label htmlFor='supplierId'>Fornecedor *</Label>
              <Select
                value={watchedValues.supplierId || ''}
                onValueChange={(value) => {
                  setValue('supplierId', value, { shouldValidate: true, shouldDirty: true });
                  trigger('supplierId');
                }}
              >
                <SelectTrigger id='supplierId' className={errors.supplierId ? 'border-destructive' : ''}>
                  <SelectValue placeholder='Selecione um fornecedor' />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.supplierId && (
                <p className='text-base text-destructive mt-1'>{errors.supplierId.message}</p>
              )}
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
                  value={watchedValues.availability || 'in_stock'}
                  onValueChange={(value: any) => {
                    setValue('availability', value, { shouldValidate: true, shouldDirty: true });
                    trigger('availability');
                  }}
                >
                  <SelectTrigger id='availability' className={errors.availability ? 'border-destructive' : ''}>
                    <SelectValue placeholder='Selecione a disponibilidade' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='in_stock'>Em Estoque</SelectItem>
                    <SelectItem value='out_of_stock'>Sem Estoque</SelectItem>
                    <SelectItem value='pre_order'>Pré-venda</SelectItem>
                  </SelectContent>
                </Select>
                {errors.availability && (
                  <p className='text-base text-destructive mt-1'>{errors.availability.message}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className='space-y-4'>
            <ImageUploadWithPaste
              onImageUpload={handleFileSelect}
              disabled={uploadingImages.size > 0 || isSubmitting}
              accept='image/jpeg,image/jpg,image/png,image/webp,image/gif'
              maxSizeMB={10}
            />

            {uploadingImages.size > 0 && (
              <div className='text-sm text-muted-foreground'>
                Enviando {uploadingImages.size} imagem(ns)...
              </div>
            )}

            {watchedValues.images && watchedValues.images.length > 0 && (
              <div className='space-y-2'>
                <Label>Imagens Adicionadas ({watchedValues.images.length})</Label>
                <div className='grid grid-cols-2 gap-2'>
                  {watchedValues.images.map((img, index) => {
                    const imgObj = typeof img === 'object' ? img : { hashId: '' };
                    const hashId = imgObj.hashId || '';
                    const isPending = (imgObj as any).isPending;
                    
                    // Se for arquivo pendente, criar preview do File
                    let imageUrl = '';
                    if (isPending && imageFiles.has(hashId)) {
                      const file = imageFiles.get(hashId);
                      if (file) {
                        imageUrl = URL.createObjectURL(file);
                      }
                    } else if (hashId && !isPending) {
                      imageUrl = `/api/products/images/${hashId}`;
                    }
                    
                    return (
                      <Card key={index}>
                        <CardContent className='pt-4'>
                          <div className='flex items-center justify-between'>
                            <div className='flex-1 min-w-0'>
                              {imageUrl && (
                                <img
                                  src={imageUrl}
                                  alt={`Imagem ${index + 1}`}
                                  className='w-full h-24 object-cover rounded'
                                  onLoad={() => {
                                    // Limpar object URL após carregar para liberar memória
                                    if (isPending && imageUrl.startsWith('blob:')) {
                                      // Não limpar imediatamente, apenas quando remover
                                    }
                                  }}
                                />
                              )}
                              <p className='text-xs text-muted-foreground mt-1 truncate'>
                                {isPending ? 'Aguardando upload...' : hashId || 'Carregando...'}
                              </p>
                            </div>
                            <Button
                              type='button'
                              variant='ghost'
                              size='sm'
                              onClick={() => {
                                handleRemoveImage(hashId);
                                // Limpar object URL se existir
                                if (imageUrl.startsWith('blob:')) {
                                  URL.revokeObjectURL(imageUrl);
                                }
                              }}
                              className='ml-2 text-destructive hover:text-destructive'
                              disabled={isSubmitting}
                            >
                              <X className='w-4 h-4' />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
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
                    {watchedValues.category
                      ? categories.find((c) => c.id === watchedValues.category)?.name || watchedValues.category
                      : 'Não selecionada'}
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
                    <div className='grid grid-cols-2 gap-2'>
                      {watchedValues.images.map((img, index) => {
                        const hashId = typeof img === 'object' && img.hashId ? img.hashId : '';
                        const imageUrl = hashId ? `/api/products/images/${hashId}` : '';
                        return (
                          <div key={index} className='relative'>
                            {imageUrl && (
                              <img
                                src={imageUrl}
                                alt={`Imagem ${index + 1}`}
                                className='w-full h-24 object-cover rounded border'
                              />
                            )}
                            <p className='text-xs text-muted-foreground mt-1 truncate'>
                              {hashId || 'Carregando...'}
                            </p>
                          </div>
                        );
                      })}
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

