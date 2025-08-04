# Arquitetura do Projeto ViralKids

## 🏗️ Visão Geral da Arquitetura

O projeto ViralKids segue os princípios de **Clean Architecture** e **SOLID**, organizando o código em camadas bem definidas com responsabilidades claras. O gerenciamento de estado é feito através do **Zustand** com persistência automática.

## 📐 Princípios Arquiteturais

### 1. Clean Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐  │
│  │   Components    │  │     Pages       │  │     UI      │  │
│  └─────────────────┘  └─────────────────┘  └─────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                    Business Logic Layer                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐  │
│  │     Hooks       │  │    Services     │  │   Utils     │  │
│  └─────────────────┘  └─────────────────┘  └─────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                      Data Layer                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐  │
│  │   API Calls     │  │   Zustand       │  │   Storage   │  │
│  │                 │  │   Stores        │  │             │  │
│  └─────────────────┘  └─────────────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 2. Princípios SOLID

#### Single Responsibility Principle (SRP)
- Cada componente tem uma única responsabilidade
- Hooks customizados para lógica específica
- Separação clara entre UI e lógica de negócio

#### Open/Closed Principle (OCP)
- Componentes extensíveis via props
- Design system modular
- Estrutura preparada para extensões

#### Liskov Substitution Principle (LSP)
- Interfaces consistentes
- Props tipadas com TypeScript
- Substituição transparente

#### Interface Segregation Principle (ISP)
- Interfaces específicas por contexto
- Props opcionais para flexibilidade
- Separação de responsabilidades

#### Dependency Inversion Principle (DIP)
- Dependências injetadas via props
- Abstração através de hooks
- Inversão de controle

## 🗂️ Estrutura de Camadas

### Presentation Layer

Responsável pela interface do usuário e interações.

#### Componentes
```typescript
// Exemplo de componente seguindo os padrões
interface HeroProps {
  title: string;
  subtitle?: string;
  ctaText: string;
  onCtaClick: () => void;
}

export const Hero = ({ title, subtitle, ctaText, onCtaClick }: HeroProps) => {
  return (
    <section className="hero-section">
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
      <Button onClick={onCtaClick}>{ctaText}</Button>
    </section>
  );
};
```

#### Páginas
```typescript
// Exemplo de página
export const HomePage = () => {
  const { data: products } = useProducts();
  const { handleContact } = useContact();

  return (
    <Layout>
      <Hero 
        title="ViralKids"
        subtitle="Produtos infantis de qualidade"
        ctaText="Ver Produtos"
        onCtaClick={() => scrollToSection('products')}
      />
      <Products products={products} />
      <Contact onSubmit={handleContact} />
    </Layout>
  );
};
```

### Business Logic Layer

Contém a lógica de negócio e regras da aplicação.

#### Hooks Customizados
```typescript
// Exemplo de hook customizado
export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, refetch: fetchProducts };
};
```

#### Serviços
```typescript
// Exemplo de serviço
export class ProductService {
  private api: ApiClient;

  constructor(api: ApiClient) {
    this.api = api;
  }

  async getAll(): Promise<Product[]> {
    return this.api.get('/products');
  }

  async getById(id: string): Promise<Product> {
    return this.api.get(`/products/${id}`);
  }

  async create(product: CreateProductDto): Promise<Product> {
    return this.api.post('/products', product);
  }
}
```

### Data Layer

Gerencia dados, estado e comunicação externa através do Zustand.

#### Zustand Stores
```typescript
// stores/cart.store.ts - Exemplo de store com persistência
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartStore {
  cart: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
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
      }
    }),
    {
      name: 'viralkids-cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ cart: state.cart }), // Só persiste cart
      version: 1, // Versionamento para invalidar cache antigo
    }
  )
);
```

#### API Client
```typescript
// Exemplo de cliente API
export class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
}
```

## 🔄 Fluxo de Dados

### Padrão Unidirecional com Zustand
```
User Action → Component → Zustand Store → Service → API → Response → Store Update → UI Update
```

### Exemplo Prático
```typescript
// 1. Usuário clica no botão
<Button onClick={handleAddToCart}>Adicionar ao Carrinho</Button>

// 2. Componente chama função da store
const handleAddToCart = () => {
  addItem(product);
};

// 3. Zustand store gerencia estado
const { addItem } = useCartStore();

// 4. Store atualiza estado automaticamente
const addItem = (product: Product) => {
  set((state) => {
    // Lógica de adição
    return { cart: [...state.cart, product] };
  });
};

// 5. UI atualiza automaticamente via seletores
const cart = useCartStore(state => state.cart);
```

## 🎯 Padrões de Design

### 1. Container/Presentational Pattern
```typescript
// Container (lógica com Zustand)
const ProductListContainer = () => {
  const { products, loading, fetchProducts } = useProductsStore();
  const { addItem } = useCartStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <ProductList 
      products={products}
      loading={loading}
      onAddToCart={addItem}
    />
  );
};

// Presentational (UI)
const ProductList = ({ products, loading, onAddToCart }: ProductListProps) => {
  if (loading) return <LoadingSpinner />;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {products.map(product => (
        <ProductCard 
          key={product.id}
          product={product}
          onAddToCart={() => onAddToCart(product)}
        />
      ))}
    </div>
  );
};
```

### 2. Custom Hook Pattern com Zustand
```typescript
// Hook customizado para lógica reutilizável
export const useCart = () => {
  const cart = useCartStore(state => state.cart);
  const addItem = useCartStore(state => state.addItem);
  const removeItem = useCartStore(state => state.removeItem);
  const clearCart = useCartStore(state => state.clearCart);
  const getCartTotal = useCartStore(state => state.getCartTotal);
  const getCartItemsCount = useCartStore(state => state.getCartItemsCount);

  return {
    cart,
    addItem,
    removeItem,
    clearCart,
    getCartTotal,
    getCartItemsCount
  };
};
```

### 3. Store Selector Pattern
```typescript
// Uso otimizado de seletores para performance
const CartSummary = () => {
  // Só re-renderiza quando cart muda
  const cart = useCartStore(state => state.cart);
  // Só re-renderiza quando total muda
  const total = useCartStore(state => state.getCartTotal());
  // Só re-renderiza quando count muda
  const count = useCartStore(state => state.getCartItemsCount());

  return (
    <div className="cart-summary">
      <p>Itens: {count}</p>
      <p>Total: R$ {total.toFixed(2)}</p>
    </div>
  );
};
```

### 4. Render Props Pattern
```typescript
// Componente com render props
interface DataFetcherProps<T> {
  url: string;
  children: (data: T | null, loading: boolean, error: Error | null) => React.ReactNode;
}

const DataFetcher = <T,>({ url, children }: DataFetcherProps<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);

  return <>{children(data, loading, error)}</>;
};
```

## 🔧 Configurações e Ferramentas

### TypeScript
- Configuração estrita para type safety
- Interfaces bem definidas
- Generics para reutilização

### ESLint
- Regras para manter qualidade do código
- Integração com TypeScript
- Padrões consistentes

### Vite
- Build tool rápido
- Hot module replacement
- Otimizações automáticas

## 📈 Escalabilidade

### Preparação para Crescimento
1. **Modularização**: Componentes independentes
2. **Lazy Loading**: Carregamento sob demanda
3. **Code Splitting**: Separação por rotas
4. **Caching**: Estratégias de cache
5. **Performance**: Otimizações contínuas

### Estrutura para Expansão
```
src/
├── features/          # Funcionalidades específicas
│   ├── auth/         # Autenticação
│   ├── products/     # Gestão de produtos
│   ├── orders/       # Pedidos
│   └── admin/        # Painel administrativo
├── shared/           # Recursos compartilhados
│   ├── components/   # Componentes reutilizáveis
│   ├── hooks/        # Hooks compartilhados
│   ├── utils/        # Utilitários
│   └── types/        # Tipos TypeScript
├── stores/           # Stores Zustand
│   ├── cart.store.ts
│   ├── products.store.ts
│   ├── filters.store.ts
│   ├── user-preferences.store.ts
│   └── index.ts
└── core/             # Núcleo da aplicação
    ├── api/          # Cliente API
    ├── providers/    # Providers da aplicação
    └── config/       # Configurações
```

---

**Próximos passos**: Implementar sistema de rotas, middleware de analytics para stores e integração com backend. 