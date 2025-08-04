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
├── hooks/           # Hooks customizados e wrappers
├── stores/          # Stores Zustand (client state)
├── services/        # Serviços e APIs
│   ├── api/         # Cliente HTTP e configurações
│   │   ├── httpClient.ts
│   │   ├── config.ts
│   │   └── endpoints.ts
│   └── queries/     # React Query hooks (server state)
│       ├── products.ts
│       └── index.ts
├── providers/       # Providers da aplicação
├── lib/             # Utilitários e configurações
├── App.tsx          # Componente raiz
└── main.tsx         # Ponto de entrada
```

## 🏗️ Arquitetura de Estado

### 🎯 Separação de Responsabilidades

O projeto ViralKids utiliza uma arquitetura híbrida para gerenciamento de estado, separando claramente as responsabilidades:

#### **Zustand (Client State)**
```typescript
// ✅ Estado que pertence ao cliente
- Carrinho de compras
- Filtros de produtos
- Preferências do usuário
- Estado de UI (sidebar, modals, etc.)
- Configurações de tema
- Estado de formulários
```

#### **React Query (Server State)**
```typescript
// ✅ Estado que vem do servidor
- Lista de produtos
- Dados do usuário
- Histórico de pedidos
- Informações de estoque
- Dados de analytics
- Configurações do sistema
```

### 🔄 Fluxo de Dados

```
User Action → Component → Hook Wrapper → React Query/Zustand → HttpClient → API → Response → Cache Update → UI Update
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
useProducts.ts
useCart.ts
useFilters.ts

// Stores: camelCase com sufixo '.store.ts'
cart.store.ts
filters.store.ts
user-preferences.store.ts

// Queries: camelCase com sufixo '.ts'
products.ts
user.ts
orders.ts

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

#### Componente com Estado Integrado
```typescript
import React from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useCartStore } from '@/stores/cart.store';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  // Server state (React Query)
  const { isLoading, error } = useProducts();
  
  // Client state (Zustand)
  const { addItem, isInCart } = useCartStore();

  const handleAddToCart = () => {
    addItem(product);
  };

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error.message}</div>;

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.price}</p>
      <Button 
        onClick={handleAddToCart}
        disabled={isInCart(product.id)}
      >
        {isInCart(product.id) ? 'No Carrinho' : 'Adicionar ao Carrinho'}
      </Button>
    </div>
  );
};
```

### 3. Gerenciamento de Estado

#### Estado Local (useState)
```typescript
// ✅ Use useState para estado local do componente
const [isOpen, setIsOpen] = useState(false);
const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
const [formData, setFormData] = useState({ name: '', email: '' });
```

#### Client State (Zustand)
```typescript
// ✅ Use Zustand para estado compartilhado do cliente
// stores/cart.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartStore {
  cart: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  isInCart: (productId: string) => boolean;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      addItem: (product) => {
        set((state) => {
          const existingItem = state.cart.find(item => item.id === product.id);
          if (existingItem) {
            return {
              cart: state.cart.map(item =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              )
            };
          }
          return {
            cart: [...state.cart, { ...product, quantity: 1 }]
          };
        });
      },
      removeItem: (productId) => {
        set((state) => ({
          cart: state.cart.filter(item => item.id !== productId)
        }));
      },
      clearCart: () => set({ cart: [] }),
      getCartTotal: () => {
        return get().cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      },
      getCartItemsCount: () => {
        return get().cart.reduce((sum, item) => sum + item.quantity, 0);
      },
      isInCart: (productId) => {
        return get().cart.some(item => item.id === productId);
      }
    }),
    {
      name: 'viralkids-cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

#### Server State (React Query)
```typescript
// ✅ Use React Query para dados do servidor
// services/queries/products.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { httpClient } from '../api/httpClient';
import { API_ENDPOINTS } from '../api/endpoints';

// Query Keys
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

// Query Hooks
export const useProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: productKeys.list(filters || {}),
    queryFn: () => fetchProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => fetchProduct(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Mutation Hooks
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateProductDto) => 
      httpClient.post<Product>(API_ENDPOINTS.PRODUCTS.CREATE, data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Invalida cache e refetch
        queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      }
    },
  });
};
```

#### Hook Wrapper (Integração)
```typescript
// ✅ Use hook wrapper para integrar Zustand + React Query
// hooks/useProducts.ts
import { useProducts as useProductsQuery } from '@/services/queries/products';
import { useCartStore } from '@/stores/cart.store';

export const useProducts = (filters?: ProductFilters) => {
  // Server state com React Query
  const queryResult = useProductsQuery(filters);
  
  // Client state com Zustand
  const { addItem, removeItem, isInCart } = useCartStore();

  return {
    // Server state
    products: queryResult.data,
    isLoading: queryResult.isLoading,
    error: queryResult.error,
    refetch: queryResult.refetch,
    
    // Client state (carrinho)
    addToCart: addItem,
    removeFromCart: removeItem,
    isInCart,
    
    // Utilitários
    hasProducts: !!queryResult.data && queryResult.data.length > 0,
    productsCount: queryResult.data?.length || 0,
  };
};
```

### 4. Uso nos Componentes

#### Componente com Estado Integrado
```typescript
// components/ProductList.tsx
import React from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useFiltersStore } from '@/stores/filters.store';

export const ProductList = () => {
  // Hook integrado que combina React Query + Zustand
  const { 
    products, 
    isLoading, 
    error, 
    addToCart, 
    isInCart,
    hasProducts 
  } = useProducts();

  // Filtros do Zustand
  const { filters, updateFilter, resetFilters } = useFiltersStore();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!hasProducts) return <EmptyState />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {products?.map(product => (
        <ProductCard 
          key={product.id}
          product={product}
          onAddToCart={() => addToCart(product)}
          isInCart={isInCart(product.id)}
        />
      ))}
    </div>
  );
};
```

### 5. Tipagem TypeScript

#### Interfaces para Server State
```typescript
// types/product.ts
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  subcategory?: string;
  inStock: boolean;
  stockQuantity?: number;
  featured: boolean;
  rating?: number;
  reviews?: number;
  tags?: string[];
  specifications?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  subcategory?: string;
  inStock: boolean;
  stockQuantity?: number;
  featured?: boolean;
  tags?: string[];
  specifications?: Record<string, any>;
}

export interface ProductFilters {
  category?: string;
  subcategory?: string;
  priceRange?: [number, number];
  inStock?: boolean;
  featured?: boolean;
  search?: string;
  sortBy?: 'name' | 'price' | 'createdAt' | 'rating';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
```

#### Interfaces para Client State
```typescript
// types/cart.ts
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface CartStore {
  cart: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  isInCart: (productId: string) => boolean;
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
<div className="text-md md:text-base lg:text-lg">
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

### 1. QueryProvider
```typescript
// providers/QueryProvider.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Não retenta em erros 4xx
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,
      throwOnError: false,
    },
    mutations: {
      retry: false,
      throwOnError: false,
    },
  },
});
```

### 2. App Providers
```typescript
// providers/index.tsx
export const AppProviders = ({ children }) => {
  return (
    <QueryProvider>
      <StoreProvider>
        {children}
      </StoreProvider>
    </QueryProvider>
  );
};
```

### 3. ESLint

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

### 4. Prettier

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

### 5. TypeScript

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
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProductCard } from '@/components/ProductCard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const mockProduct = {
  id: '1',
  name: 'Brinquedo Teste',
  price: 29.99,
  image: '/test-image.jpg'
};

describe('ProductCard', () => {
  it('should render product information', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ProductCard product={mockProduct} />
      </QueryClientProvider>
    );
    
    expect(screen.getByText('Brinquedo Teste')).toBeInTheDocument();
    expect(screen.getByText('R$ 29,99')).toBeInTheDocument();
  });
});
```

### 2. Testes de Hooks

```typescript
// __tests__/useProducts.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProducts } from '@/hooks/useProducts';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

describe('useProducts', () => {
  it('should fetch products on mount', async () => {
    const { result } = renderHook(() => useProducts(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });
    
    expect(result.current.isLoading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
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

### 2. React Query DevTools
```typescript
// Adicione ao QueryProvider para desenvolvimento
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export const QueryProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
```

### 3. Console Logging
```typescript
// Logs estruturados
console.group('Product Actions');
console.log('Adding product:', product);
console.log('Current cart:', cart);
console.groupEnd();
```

### 4. Error Boundaries
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

## 🚀 Boas Práticas

### 1. Separação de Responsabilidades
```typescript
// ✅ CORRETO: Server state com React Query
const { data: products, isLoading } = useProducts();

// ✅ CORRETO: Client state com Zustand
const { cart, addItem } = useCartStore();

// ❌ EVITAR: Misturar responsabilidades
const [products, setProducts] = useState([]); // Server state em useState
const { data: cart } = useCart(); // Client state em React Query
```

### 2. Cache e Performance
```typescript
// ✅ CORRETO: Cache inteligente com React Query
export const useProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: productKeys.list(filters || {}),
    queryFn: () => fetchProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
  });
};

// ✅ CORRETO: Seletores otimizados com Zustand
const CartCounter = () => {
  const itemsCount = useCartStore(state => state.getCartItemsCount());
  return <span>{itemsCount}</span>;
};
```

### 3. Error Handling
```typescript
// ✅ CORRETO: Error handling consistente
const ProductList = () => {
  const { products, isLoading, error } = useProducts();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!products?.length) return <EmptyState />;

  return <div>{/* render products */}</div>;
};
```

### 4. Type Safety
```typescript
// ✅ CORRETO: Tipagem completa
interface Product {
  id: string;
  name: string;
  price: number;
  // ... outras propriedades
}

const useProducts = (): {
  products: Product[] | undefined;
  isLoading: boolean;
  error: Error | null;
} => {
  // implementação
};
```

## 📚 Recursos Adicionais

### Documentação
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

### Ferramentas
- [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools)
- [React Query DevTools](https://tanstack.com/query/latest/docs/react/devtools)
- [TypeScript Playground](https://www.typescriptlang.org/play)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

---

**Lembre-se**: Mantenha o código limpo, bem documentado e siga os padrões estabelecidos para facilitar a manutenção e colaboração. A separação clara entre server state (React Query) e client state (Zustand) é fundamental para a arquitetura do projeto. 