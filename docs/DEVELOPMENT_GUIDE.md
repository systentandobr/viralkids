# Guia de Desenvolvimento ViralKids

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 18+ 
- pnpm ou yarn
- Git

### Instalação
```bash
# Clone o repositório
git clone [url-do-repositorio]
cd viralkids

# Instale as dependências
pnpm install

# Inicie o servidor de desenvolvimento
pnpm dev
```

### Scripts Disponíveis
```bash
pnpm dev          # Servidor de desenvolvimento
pnpm build        # Build de produção
pnpm build:dev    # Build de desenvolvimento
pnpm lint         # Verificar código
pnpm preview      # Preview do build
```

## 📁 Estrutura do Projeto

### Organização de Pastas

```
src/
├── assets/           # Imagens e recursos estáticos
├── components/       # Componentes da aplicação
│   ├── ui/          # Componentes base (shadcn/ui)
│   ├── Hero.tsx     # Seção hero
│   ├── Header.tsx   # Cabeçalho
│   ├── Footer.tsx   # Rodapé
│   ├── Products.tsx # Seção de produtos
│   ├── Contact.tsx  # Seção de contato
│   └── Franchise.tsx # Seção de franquias
├── pages/           # Páginas da aplicação
├── hooks/           # Hooks customizados
├── lib/             # Utilitários e configurações
├── App.tsx          # Componente raiz
└── main.tsx         # Ponto de entrada
```

## 🛠️ Padrões de Desenvolvimento

### 1. Nomenclatura

#### Arquivos e Pastas
```typescript
// Componentes: PascalCase
ProductCard.tsx
UserProfile.tsx
ShoppingCart.tsx

// Hooks: camelCase com prefixo 'use'
useProductData.ts
useLocalStorage.ts
useApiCall.ts

// Utilitários: camelCase
formatPrice.ts
validateEmail.ts
apiClient.ts

// Constantes: UPPER_SNAKE_CASE
API_ENDPOINTS.ts
PRODUCT_CATEGORIES.ts
```

#### Variáveis e Funções
```typescript
// Variáveis: camelCase
const productList = [];
const userData = {};
const isLoading = false;

// Funções: camelCase
const fetchProducts = () => {};
const handleSubmit = () => {};
const formatCurrency = () => {};

// Constantes: UPPER_SNAKE_CASE
const MAX_PRODUCTS = 10;
const API_BASE_URL = 'https://api.viralkids.com';
```

### 2. Estrutura de Componentes

#### Template Básico
```typescript
import React from 'react';
import { cn } from '@/lib/utils';

interface ComponentNameProps {
  title: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

export const ComponentName = ({ 
  title, 
  description, 
  className,
  children 
}: ComponentNameProps) => {
  return (
    <div className={cn('component-base', className)}>
      <h2 className="text-2xl font-semibold">{title}</h2>
      {description && (
        <p className="text-muted-foreground mt-2">{description}</p>
      )}
      {children}
    </div>
  );
};
```

#### Componente com Estado
```typescript
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      await onAddToCart(product);
      // Feedback de sucesso
    } catch (error) {
      // Tratamento de erro
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.price}</p>
      <Button 
        onClick={handleAddToCart}
        disabled={isLoading}
      >
        {isLoading ? 'Adicionando...' : 'Adicionar ao Carrinho'}
      </Button>
    </div>
  );
};
```

### 3. Hooks Customizados

#### Template de Hook
```typescript
import { useState, useEffect, useCallback } from 'react';

interface UseCustomHookOptions {
  enabled?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export const useCustomHook = (options: UseCustomHookOptions = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!options.enabled) return;

    setLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      setData(result);
      options.onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      options.onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};
```

#### Hook de Exemplo
```typescript
// hooks/useProducts.ts
import { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Simular chamada API
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao buscar produtos'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, error, refetch: fetchProducts };
};
```

### 4. Tipagem TypeScript

#### Interfaces Básicas
```typescript
// types/product.ts
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: ProductCategory;
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ProductCategory = 'brinquedos' | 'roupas' | 'acessorios' | 'livros';

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  image: string;
  category: ProductCategory;
}
```

#### Props de Componentes
```typescript
// Componente com props tipadas
interface ProductListProps {
  products: Product[];
  loading?: boolean;
  onProductClick?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  className?: string;
}

export const ProductList = ({
  products,
  loading = false,
  onProductClick,
  onAddToCart,
  className
}: ProductListProps) => {
  // Implementação
};
```

### 5. Gerenciamento de Estado

#### Estado Local
```typescript
// Para estado simples, use useState
const [isOpen, setIsOpen] = useState(false);
const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
```

#### Estado Compartilhado
```typescript
// Para estado compartilhado, use Context ou Zustand
// hooks/useCart.ts
import { create } from 'zustand';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  total: number;
}

export const useCart = create<CartStore>((set, get) => ({
  items: [],
  addItem: (product) => {
    set((state) => {
      const existingItem = state.items.find(item => item.id === product.id);
      if (existingItem) {
        return {
          items: state.items.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      return {
        items: [...state.items, { ...product, quantity: 1 }]
      };
    });
  },
  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter(item => item.id !== productId)
    }));
  },
  clearCart: () => set({ items: [] }),
  get total() {
    return get().items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }
}));
```

## 🎨 Estilização

### 1. Tailwind CSS

#### Classes Utilitárias
```typescript
// Layout
<div className="container mx-auto px-4 py-8">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
<div className="flex items-center justify-between">

// Espaçamento
<div className="p-4 m-2">
<div className="px-6 py-4">
<div className="space-y-4">

// Cores do design system
<div className="bg-primary text-primary-foreground">
<div className="text-muted-foreground">
<div className="border border-border">
```

#### Classes Customizadas
```css
/* Adicione ao index.css */
@layer components {
  .btn-primary {
    @apply bg-primary text-primary-foreground hover:bg-primary/90;
  }
  
  .card-hover {
    @apply transition-all duration-200 hover:shadow-lg hover:-translate-y-1;
  }
  
  .text-gradient {
    @apply bg-gradient-to-r from-bronze to-copper bg-clip-text text-transparent;
  }
}
```

### 2. Responsividade

#### Breakpoints
```typescript
// Mobile First
<div className="w-full md:w-1/2 lg:w-1/3">
<div className="text-sm md:text-base lg:text-lg">
<div className="p-4 md:p-6 lg:p-8">
```

#### Layout Responsivo
```typescript
// Grid responsivo
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

// Flex responsivo
<div className="flex flex-col md:flex-row items-center gap-4">

// Texto responsivo
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
```

## 🔧 Configurações

### 1. ESLint

#### Regras Importantes
```json
{
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "react-hooks/exhaustive-deps": "warn",
    "prefer-const": "error"
  }
}
```

### 2. Prettier

#### Configuração
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

### 3. TypeScript

#### Configuração Recomendada
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

## 🧪 Testes

### 1. Testes de Componentes

#### Template de Teste
```typescript
// __tests__/ProductCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '@/components/ProductCard';

const mockProduct = {
  id: '1',
  name: 'Brinquedo Teste',
  price: 29.99,
  image: '/test-image.jpg'
};

describe('ProductCard', () => {
  it('should render product information', () => {
    render(<ProductCard product={mockProduct} onAddToCart={jest.fn()} />);
    
    expect(screen.getByText('Brinquedo Teste')).toBeInTheDocument();
    expect(screen.getByText('R$ 29,99')).toBeInTheDocument();
  });

  it('should call onAddToCart when button is clicked', () => {
    const mockOnAddToCart = jest.fn();
    render(<ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />);
    
    fireEvent.click(screen.getByText('Adicionar ao Carrinho'));
    expect(mockOnAddToCart).toHaveBeenCalledWith(mockProduct);
  });
});
```

### 2. Testes de Hooks

```typescript
// __tests__/useProducts.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useProducts } from '@/hooks/useProducts';

describe('useProducts', () => {
  it('should fetch products on mount', async () => {
    const { result } = renderHook(() => useProducts());
    
    expect(result.current.loading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.products).toHaveLength(3);
  });
});
```

## 📦 Deploy

### 1. Build de Produção
```bash
# Build otimizado
pnpm build

# Verificar build
pnpm preview
```

### 2. Variáveis de Ambiente
```bash
# .env.local
VITE_API_URL=https://api.viralkids.com
VITE_WHATSAPP_NUMBER=5511999999999
VITE_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
```

### 3. Deploy no Vercel
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## 🔍 Debugging

### 1. React DevTools
- Instale a extensão do navegador
- Use para inspecionar componentes e estado

### 2. Console Logging
```typescript
// Logs estruturados
console.group('Product Actions');
console.log('Adding product:', product);
console.log('Current cart:', cart);
console.groupEnd();
```

### 3. Error Boundaries
```typescript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Algo deu errado.</h1>;
    }

    return this.props.children;
  }
}
```

## 📚 Recursos Adicionais

### Documentação
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)

### Ferramentas
- [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools)
- [TypeScript Playground](https://www.typescriptlang.org/play)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

---

**Lembre-se**: Mantenha o código limpo, bem documentado e siga os padrões estabelecidos para facilitar a manutenção e colaboração. 