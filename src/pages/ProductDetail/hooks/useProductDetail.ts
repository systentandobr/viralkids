import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useCart } from '@/pages/Ecommerce/hooks/useCart';
import { 
  ProductDetailData, 
  SelectedVariations, 
  UseProductDetailReturn,
  ProductInteractionEvent
} from '../types/product-detail.types';

// Mock data service - em um caso real, seria um serviço real
const mockProductDetailService = {
  async getProductById(id: string): Promise<ProductDetailData | null> {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock data - em um caso real, viria de uma API
    const mockProduct: ProductDetailData = {
      id: id,
      name: 'Vestido Infantil Princesa Encantada',
      description: 'Lindo vestido infantil com tema de princesa, perfeito para festas e ocasiões especiais. Confeccionado com tecidos de alta qualidade e acabamento impecável.',
      price: 89.90,
      originalPrice: 119.90,
      discount: 25,
      category: 'roupas',
      brand: 'Little Princess',
      images: [
        '/api/placeholder/600/600',
        '/api/placeholder/600/600',
        '/api/placeholder/600/600',
        '/api/placeholder/600/600',
        '/api/placeholder/600/600'
      ],
      thumbnail: '/api/placeholder/400/400',
      inStock: true,
      stockQuantity: 15,
      minAge: 2,
      maxAge: 8,
      colors: ['Rosa', 'Azul', 'Lilás'],
      sizes: ['2 anos', '4 anos', '6 anos', '8 anos'],
      tags: ['festa', 'princesa', 'elegante'],
      rating: 4.8,
      reviewCount: 24,
      isFeatured: true,
      isNew: false,
      franchiseId: 'franchise-1',
      franchiseName: 'Kids Fashion Store',
      franchiseLocation: 'São Paulo, SP',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-20T14:45:00Z',
      
      variations: [
        { id: '1', type: 'color', name: 'Rosa', value: 'pink', displayValue: 'Rosa', available: true, stock: 5, images: ['/api/placeholder/600/600'] },
        { id: '2', type: 'color', name: 'Azul', value: 'blue', displayValue: 'Azul', available: true, stock: 3, images: ['/api/placeholder/600/600'] },
        { id: '3', type: 'color', name: 'Lilás', value: 'purple', displayValue: 'Lilás', available: true, stock: 7, images: ['/api/placeholder/600/600'] },
        { id: '4', type: 'size', name: '2 anos', value: '2y', displayValue: '2 anos', available: true, stock: 8 },
        { id: '5', type: 'size', name: '4 anos', value: '4y', displayValue: '4 anos', available: true, stock: 6 },
        { id: '6', type: 'size', name: '6 anos', value: '6y', displayValue: '6 anos', available: true, stock: 4 },
        { id: '7', type: 'size', name: '8 anos', value: '8y', displayValue: '8 anos', available: false, stock: 0 },
      ],
      
      sizeGuide: {
        id: '1',
        category: 'clothing',
        sizes: [
          { size: '2 anos', chest: 52, waist: 48, length: 55, unit: 'cm', age: '2-3 anos', weight: '12-15kg' },
          { size: '4 anos', chest: 56, waist: 52, length: 62, unit: 'cm', age: '3-4 anos', weight: '15-18kg' },
          { size: '6 anos', chest: 60, waist: 56, length: 68, unit: 'cm', age: '5-6 anos', weight: '18-22kg' },
          { size: '8 anos', chest: 64, waist: 60, length: 75, unit: 'cm', age: '7-8 anos', weight: '22-26kg' },
        ],
        instructions: [
          'Use uma fita métrica flexível para medir',
          'Peito: Meça ao redor da parte mais larga do peito',
          'Cintura: Meça na parte mais estreita da cintura',
          'Comprimento: Meça do ombro até a barra desejada',
          'Para melhor resultado, peça ajuda para medir'
        ]
      },
      
      reviews: [
        {
          id: '1',
          userId: 'user1',
          userName: 'Maria Silva',
          userAvatar: '/api/placeholder/40/40',
          rating: 5,
          title: 'Perfeito para festa!',
          comment: 'Minha filha amou o vestido! A qualidade é excelente e chegou muito bem embalado. O tecido é macio e o acabamento impecável.',
          verified: true,
          helpful: 8,
          notHelpful: 0,
          size: '4 anos',
          color: 'Rosa',
          fit: 'perfect',
          quality: 5,
          delivery: 5,
          createdAt: '2024-01-10T14:30:00Z',
          updatedAt: '2024-01-10T14:30:00Z',
          images: ['/api/placeholder/200/200', '/api/placeholder/200/200'],
          pros: ['Qualidade excelente', 'Chegou rápido', 'Criança adorou'],
          cons: []
        },
        {
          id: '2',
          userId: 'user2',
          userName: 'Ana Costa',
          userAvatar: '/api/placeholder/40/40',
          rating: 4,
          title: 'Muito bonito, mas cuidado com o tamanho',
          comment: 'O vestido é lindo e a qualidade é boa. Porém, veio um pouco maior que o esperado. Recomendo verificar bem a tabela de medidas.',
          verified: true,
          helpful: 5,
          notHelpful: 1,
          size: '6 anos',
          color: 'Azul',
          fit: 'large',
          quality: 4,
          delivery: 4,
          createdAt: '2024-01-08T10:15:00Z',
          updatedAt: '2024-01-08T10:15:00Z',
          images: ['/api/placeholder/200/200'],
          pros: ['Muito bonito', 'Boa qualidade'],
          cons: ['Tamanho maior que esperado']
        }
      ],
      
      questions: [],
      specifications: {
        'Material': '100% Algodão',
        'Forro': 'Tule duplo',
        'Fechamento': 'Zíper traseiro',
        'Lavagem': 'Máquina - ciclo delicado',
        'Origem': 'Brasil',
        'Idade recomendada': '2 a 8 anos'
      },
      
      materials: ['Algodão', 'Tule', 'Fita de cetim'],
      careInstructions: [
        'Lave à máquina em ciclo delicado',
        'Não use alvejante',
        'Seque à sombra',
        'Passe com ferro morno'
      ],
      
      warranty: '30 dias contra defeitos de fabricação',
      origin: 'São Paulo, Brasil',
      
      shipping: {
        freeShipping: true,
        minOrderValue: 79.90,
        estimatedDays: 7,
        methods: ['Correios', 'Transportadora']
      },
      
      relatedProducts: ['2', '3', '4'],
      categoryPath: ['Roupas', 'Vestidos', 'Festa'],
      
      brandInfo: {
        name: 'Little Princess',
        logo: '/api/placeholder/80/80',
        description: 'Marca especializada em roupas infantis elegantes'
      },
      
      availability: {
        inStock: true,
        quantity: 15,
        preOrder: { available: false }
      }
    };
    
    return mockProduct;
  }
};

export const useProductDetail = (productId: string): UseProductDetailReturn => {
  const [product, setProduct] = useState<ProductDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariations, setSelectedVariations] = useState<SelectedVariations>({});
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  
  const { addToCart: addToCartService } = useCart();

  // Carregar produto
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const productData = await mockProductDetailService.getProductById(productId);
        
        if (!productData) {
          setError('Produto não encontrado');
          return;
        }
        
        setProduct(productData);
        
        // Auto-selecionar primeira variação disponível de cada tipo
        const autoSelectedVariations: SelectedVariations = {};
        const variationTypes = [...new Set(productData.variations.map(v => v.type))];
        
        variationTypes.forEach(type => {
          const firstAvailable = productData.variations.find(v => v.type === type && v.available);
          if (firstAvailable) {
            autoSelectedVariations[type] = firstAvailable.value;
          }
        });
        
        setSelectedVariations(autoSelectedVariations);
        
      } catch (err) {
        setError('Erro ao carregar produto');
        console.error('Erro ao carregar produto:', err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadProduct();
    }
  }, [productId]);

  // Calcular estoque disponível baseado nas variações selecionadas
  const availableStock = React.useMemo(() => {
    if (!product) return 0;
    
    let minStock = product.stockQuantity;
    
    Object.entries(selectedVariations).forEach(([type, value]) => {
      const variation = product.variations.find(v => v.type === type && v.value === value);
      if (variation) {
        minStock = Math.min(minStock, variation.stock);
      }
    });
    
    return minStock;
  }, [product, selectedVariations]);

  // Calcular preço atual baseado nas variações
  const currentPrice = React.useMemo(() => {
    if (!product) return 0;
    
    let price = product.price;
    Object.entries(selectedVariations).forEach(([type, value]) => {
      const variation = product.variations.find(v => v.type === type && v.value === value);
      if (variation?.price) {
        price += variation.price;
      }
    });
    
    return price;
  }, [product, selectedVariations]);

  // Obter imagens baseadas nas variações selecionadas
  const selectedImages = React.useMemo(() => {
    if (!product) return [];
    
    // Procurar por imagens específicas das variações selecionadas
    const variationImages: string[] = [];
    
    Object.entries(selectedVariations).forEach(([type, value]) => {
      const variation = product.variations.find(v => v.type === type && v.value === value);
      if (variation?.images) {
        variationImages.push(...variation.images);
      }
    });
    
    // Se não houver imagens específicas, usar as imagens padrão
    return variationImages.length > 0 ? variationImages : product.images;
  }, [product, selectedVariations]);

  // Adicionar ao carrinho
  const addToCart = useCallback(() => {
    if (!product) return;
    
    addToCartService({
      ...product,
      price: currentPrice
    }, selectedQuantity, {
      color: selectedVariations.color,
      size: selectedVariations.size
    });
  }, [product, currentPrice, selectedQuantity, selectedVariations, addToCartService]);

  // Adicionar à lista de desejos
  const addToWishlist = useCallback(() => {
    if (!product) return;
    
    // TODO: Implementar serviço de wishlist
    console.log('Adicionado à lista de desejos:', product.id);
  }, [product]);

  // Compartilhar produto
  const shareProduct = useCallback((method: string) => {
    if (!product) return;
    
    const url = window.location.href;
    const text = `Confira este produto: ${product.name}`;
    
    switch (method) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        // TODO: Mostrar toast de sucesso
        break;
      default:
        console.log('Método de compartilhamento não suportado:', method);
    }
  }, [product]);

  // Rastrear visualização do produto
  const trackView = useCallback(() => {
    if (!product) return;
    
    // TODO: Implementar analytics
    console.log('Product view tracked:', {
      productId: product.id,
      productName: product.name,
      category: product.category,
      brand: product.brand,
      price: currentPrice
    });
  }, [product, currentPrice]);

  // Rastrear interações
  const trackInteraction = useCallback((event: ProductInteractionEvent) => {
    // TODO: Implementar analytics
    console.log('Product interaction tracked:', event);
  }, []);

  // Rastrear visualização quando o produto for carregado
  useEffect(() => {
    if (product && !loading) {
      // TODO: Implementar analytics
      console.log('Product view tracked:', {
        productId: product.id,
        productName: product.name,
        category: product.category,
        brand: product.brand,
        price: currentPrice
      });
    }
  }, [product, loading, currentPrice]); // Remover trackView da dependência

  return {
    product,
    loading,
    error,
    selectedVariations,
    selectedQuantity,
    availableStock,
    currentPrice,
    selectedImages,
    setSelectedVariations,
    setSelectedQuantity,
    addToCart,
    addToWishlist,
    shareProduct,
    trackView,
    trackInteraction
  };
};