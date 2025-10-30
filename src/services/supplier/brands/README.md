# 🏷️ Sistema de Marcas em Destaque

Este módulo implementa um sistema completo para gerenciar marcas em destaque (parceiros estratégicos) usando React Query e dados baseados em fornecedores reais do Ceará.

## 📁 Estrutura de Arquivos

```
src/services/supplier/brands/
├── types.ts              # Interface Brand expandida
├── mockData.ts           # Dados mock baseados em fornecedores reais
├── brandService.ts       # Serviços para operações com marcas
├── hooks/
│   ├── useFeaturedBrands.ts  # Hooks do React Query
│   └── index.ts              # Exports dos hooks
├── index.ts              # Exports principais
└── README.md             # Esta documentação
```

## 🎯 Funcionalidades

### ✅ Marcas em Destaque
- **13 marcas reais** baseadas em fornecedores do Ceará
- **Sistema de rankeamento** (Gold, Silver, Bronze)
- **Dados completos** com localização, Instagram, website
- **Categorização** por tipo de produto e gênero

### ✅ React Query Integration
- **Cache inteligente** com TTL configurável
- **Loading states** e error handling
- **Background sync** automático
- **Query keys** organizadas

### ✅ Hooks Disponíveis

```typescript
// Buscar todas as marcas em destaque
const { data: brands, isLoading, error } = useFeaturedBrands();

// Buscar marcas por nível de parceria
const { data: goldBrands } = useBrandsByPartnershipLevel('gold');

// Buscar marcas por categoria
const { data: clothingBrands } = useBrandsByCategory('clothing');

// Buscar estatísticas
const { data: stats } = useBrandStats();
```

## 🏆 Níveis de Parceria

### 🥇 Gold Partners (4 marcas)
- **Dinnus Kids** - Moda infantil básica
- **Charminho** - Vestidos e conjuntos arrumados
- **Mini Dylla** - Moda bebê e calçados
- **FUMP Kids** - Moda infantil premium

### 🥈 Silver Partners (4 marcas)
- **D'Afeto** - Acessórios e vestidos estampados
- **Gritty Moda Teen** - Moda praia e vestidos
- **BEGKIDS** - Vestidos e conjuntos estampados
- **Espaço Kids Prime** - Moda completa

### 🥉 Bronze Partners (5 marcas)
- **Toninho Kids** - Camisas e bermudas
- **KOLI** - Moda básica para meninos
- **RCK** - Camisas e bermudas masculinas
- **Estilosinhos** - Vestidos e conjuntos
- **TIGROM** - Moda básica e confortável

## 🚀 Como Usar

### 1. Importar Hooks

```typescript
import { 
  useFeaturedBrands, 
  useBrandsByPartnershipLevel, 
  useBrandStats 
} from '@/services/supplier/brands/hooks';
```

### 2. Usar no Componente

```typescript
const MyComponent = () => {
  const { data: brands, isLoading, error } = useFeaturedBrands();
  const { data: stats } = useBrandStats();

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar</div>;

  return (
    <div>
      <h2>Marcas em Destaque ({stats?.totalBrands})</h2>
      {brands?.map(brand => (
        <div key={brand.id}>
          <h3>{brand.name}</h3>
          <p>{brand.description}</p>
          <span>📍 {brand.location}</span>
        </div>
      ))}
    </div>
  );
};
```

### 3. Filtrar por Nível

```typescript
const GoldPartners = () => {
  const { data: goldBrands } = useBrandsByPartnershipLevel('gold');
  
  return (
    <div>
      <h2>🥇 Parceiros Gold</h2>
      {goldBrands?.map(brand => (
        <div key={brand.id}>
          <h3>{brand.name}</h3>
          <p>{brand.description}</p>
        </div>
      ))}
    </div>
  );
};
```

## 📊 Estatísticas Disponíveis

```typescript
interface BrandStats {
  totalBrands: number;      // Total de marcas ativas
  totalProducts: number;    // Soma de todos os produtos
  goldPartners: number;     // Quantidade de parceiros Gold
  silverPartners: number;   // Quantidade de parceiros Silver
  bronzePartners: number;   // Quantidade de parceiros Bronze
}
```

## 🔧 Configuração

### Cache Settings
- **staleTime**: 5 minutos (dados considerados frescos)
- **gcTime**: 10 minutos (tempo no cache)
- **refetchOnWindowFocus**: false
- **refetchOnReconnect**: true

### Error Handling
- **Retry**: 3 tentativas para erros 5xx
- **No retry**: para erros 4xx
- **throwOnError**: false (erros não quebram a aplicação)

## 🎨 Interface Brand

```typescript
interface Brand {
  id: string;
  name: string;
  logo: string;
  description: string;
  isActive: boolean;
  productCount: number;
  location: string;
  instagram?: string;
  website?: string;
  category: 'clothing' | 'accessories' | 'toys' | 'shoes' | 'mixed';
  gender: 'meninas' | 'meninos' | 'unisex';
  partnershipLevel: 'gold' | 'silver' | 'bronze';
  featuredUntil?: string;
}
```

## 🔄 Migração de Dados

### Antes (Mock Simples)
```typescript
const mockBrands = [
  { id: 'little-princess', name: 'Little Princess', ... }
];
```

### Depois (Dados Reais + React Query)
```typescript
const { data: brands } = useFeaturedBrands();
// Dados vêm do cache do React Query
// Baseados em fornecedores reais do Ceará
```

## 🧪 Testes

### Teste de Hook
```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useFeaturedBrands } from './hooks/useFeaturedBrands';

test('should fetch featured brands', async () => {
  const { result } = renderHook(() => useFeaturedBrands());
  
  expect(result.current.isLoading).toBe(true);
  
  await waitFor(() => {
    expect(result.current.isLoading).toBe(false);
  });
  
  expect(result.current.data).toHaveLength(13);
});
```

## 🚀 Próximos Passos

1. **Integração com API real** - Substituir dados mock por chamadas reais
2. **Filtros avançados** - Por localização, categoria, gênero
3. **Sistema de avaliação** - Rating das marcas pelos usuários
4. **Analytics** - Métricas de performance das parcerias
5. **Dashboard admin** - Gerenciamento de marcas em destaque

## 📝 Notas

- ✅ **Dados reais**: Baseados em fornecedores autênticos do Ceará
- ✅ **Performance**: Cache otimizado com React Query
- ✅ **Type Safety**: TypeScript completo
- ✅ **Escalabilidade**: Fácil adição de novas funcionalidades
- ✅ **SEO**: Links para Instagram e websites dos fornecedores 