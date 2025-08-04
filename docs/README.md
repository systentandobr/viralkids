# ViralKids - Documentação do Projeto

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura do Projeto](#arquitetura-do-projeto)
3. [Design System](#design-system)
4. [Guia de Desenvolvimento](#guia-de-desenvolvimento)
5. [Estrutura de Pastas](#estrutura-de-pastas)
6. [Padrões de Código](#padrões-de-código)
7. [Funcionalidades](#funcionalidades)
8. [Roadmap](#roadmap)

## 🎯 Visão Geral

O **ViralKids** é uma plataforma de vendas focada em produtos infantis, desenvolvida com React, TypeScript e Tailwind CSS. O projeto segue os princípios de **Arquitetura Limpa** e **SOLID**, garantindo código escalável, testável e de fácil manutenção.

### Objetivos do Projeto

- **MVP Sustentável**: Plataforma de vendas otimizada para conversão
- **Conteúdo Dinâmico**: Sistema administrativo para gerenciamento de conteúdo
- **Automatização**: Processos otimizados para demonstrar competência técnica
- **Melhoria Contínua**: Estrutura preparada para evolução baseada em dados

### Stack Tecnológica

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Build Tool**: Vite
- **State Management**: Zustand com persistência automática
- **Forms**: React Hook Form + Zod
- **UI Components**: Radix UI
- **Icons**: Lucide React

## 🏗️ Arquitetura do Projeto

### Princípios SOLID Aplicados

#### 1. **Single Responsibility Principle (SRP)**
- Cada componente tem uma única responsabilidade
- Separação clara entre UI, lógica de negócio e dados
- Hooks customizados para lógica reutilizável

#### 2. **Open/Closed Principle (OCP)**
- Componentes extensíveis através de props
- Design system modular e customizável
- Estrutura preparada para novas funcionalidades

#### 3. **Liskov Substitution Principle (LSP)**
- Interfaces consistentes entre componentes
- Props tipadas com TypeScript
- Substituição transparente de implementações

#### 4. **Interface Segregation Principle (ISP)**
- Interfaces específicas para cada contexto
- Props opcionais para flexibilidade
- Separação de responsabilidades em hooks

#### 5. **Dependency Inversion Principle (DIP)**
- Dependências injetadas via props
- Hooks customizados para abstração
- Separação entre UI e lógica de negócio

### Camadas da Arquitetura

```
┌─────────────────────────────────────┐
│           Presentation Layer        │
│  (Components, Pages, UI Elements)   │
├─────────────────────────────────────┤
│           Business Logic Layer      │
│     (Hooks, Services, Utils)        │
├─────────────────────────────────────┤
│           Data Layer                │
│    (API Calls, State Management)    │
└─────────────────────────────────────┘
```

## 🎨 Design System

### Paleta de Cores

O design system utiliza uma paleta baseada em tons quentes e acolhedores:

#### Cores Principais
- **Bronze**: `hsl(25 95% 53%)` - Cor primária da marca
- **Copper**: `hsl(15 85% 45%)` - Cor secundária
- **Gold**: `hsl(45 95% 60%)` - Cor de destaque

#### Cores de Interface
- **Background**: `hsl(20 20% 98%)` - Fundo principal
- **Card**: `hsl(25 45% 95%)` - Fundo de cards
- **Border**: `hsl(25 30% 88%)` - Bordas sutis

### Gradientes

```css
--gradient-bronze: linear-gradient(135deg, hsl(25 95% 53%), hsl(15 85% 45%));
--gradient-hero: linear-gradient(135deg, hsl(25 95% 53%) 0%, hsl(35 90% 60%) 50%, hsl(45 95% 60%) 100%);
--gradient-card: linear-gradient(145deg, hsl(25 45% 95%), hsl(30 40% 92%));
```

### Tipografia

- **Font Family**: Sistema padrão (Inter/SF Pro)
- **Hierarquia**: Baseada em tamanhos consistentes
- **Pesos**: Regular (400), Medium (500), Semibold (600), Bold (700)

### Componentes Base

Todos os componentes seguem o padrão shadcn/ui com customizações da marca:

- **Button**: Variações primária, secundária, outline, ghost
- **Card**: Containers com sombras sutis
- **Badge**: Indicadores de status e categorias
- **Input**: Campos de formulário consistentes

## 📁 Estrutura de Pastas

```
src/
├── assets/           # Imagens e recursos estáticos
├── components/       # Componentes da aplicação
│   ├── ui/          # Componentes base (shadcn/ui)
│   ├── Hero.tsx     # Seção hero da página
│   ├── Header.tsx   # Cabeçalho da aplicação
│   ├── Footer.tsx   # Rodapé da aplicação
│   ├── Products.tsx # Seção de produtos
│   ├── Contact.tsx  # Seção de contato
│   └── Franchise.tsx # Seção de franquias
├── pages/           # Páginas da aplicação
├── hooks/           # Hooks customizados
├── stores/          # Stores Zustand
│   ├── cart.store.ts
│   ├── products.store.ts
│   ├── filters.store.ts
│   ├── user-preferences.store.ts
│   └── index.ts
├── providers/       # Providers da aplicação
├── lib/             # Utilitários e configurações
├── App.tsx          # Componente raiz
└── main.tsx         # Ponto de entrada
```

## 🛠️ Guia de Desenvolvimento

### Criando um Novo Componente

1. **Defina a responsabilidade**: Cada componente deve ter uma função específica
2. **Use TypeScript**: Sempre tipar props e retornos
3. **Siga o padrão de nomenclatura**: PascalCase para componentes
4. **Implemente acessibilidade**: Use componentes Radix UI como base

```typescript
// Exemplo de componente seguindo os padrões
interface ComponentProps {
  title: string;
  description?: string;
  onAction?: () => void;
}

export const Component = ({ title, description, onAction }: ComponentProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
      {description && (
        <p className="text-muted-foreground mt-2">{description}</p>
      )}
      {onAction && (
        <Button onClick={onAction} className="mt-4">
          Ação
        </Button>
      )}
    </Card>
  );
};
```

### Criando uma Nova Página

1. **Crie o arquivo** em `src/pages/`
2. **Importe componentes** existentes quando possível
3. **Use o layout** consistente com o design system
4. **Implemente responsividade** para mobile e desktop

### Padrões de Nomenclatura

- **Componentes**: PascalCase (`ProductCard.tsx`)
- **Hooks**: camelCase com prefixo `use` (`useProductData.ts`)
- **Utilitários**: camelCase (`formatPrice.ts`)
- **Constantes**: UPPER_SNAKE_CASE (`API_ENDPOINTS`)

## 🎯 Funcionalidades Atuais

### Páginas Principais

1. **Home Page** (`/`)
   - Hero section com call-to-action
   - Seção de produtos em destaque
   - Informações sobre franquias
   - Formulário de contato

### Componentes Principais

- **Header**: Navegação e branding
- **Hero**: Seção principal com CTA
- **Products**: Exibição de produtos
- **Franchise**: Informações sobre franquias
- **Contact**: Formulário de contato
- **Footer**: Links e informações da empresa

### Funcionalidades Técnicas

- **Responsive Design**: Adaptação para todos os dispositivos
- **Dark Mode**: Suporte a tema escuro
- **Form Validation**: Validação com React Hook Form + Zod
- **Toast Notifications**: Feedback visual para usuários
- **WhatsApp Integration**: Integração direta com WhatsApp
- **State Management**: Zustand com persistência automática
- **Cache Inteligente**: Cache de produtos com TTL automático

## 🚀 Roadmap

### Fase 1: MVP Atual ✅
- [x] Landing page responsiva
- [x] Design system implementado
- [x] Componentes base criados
- [x] Integração com WhatsApp

### Fase 2: Sistema Administrativo 🚧
- [ ] Painel administrativo
- [ ] CRUD de produtos
- [ ] Gerenciamento de conteúdo
- [ ] Sistema de usuários

### Fase 3: Automação e Analytics 📊
- [ ] Analytics integrado
- [ ] Automação de processos
- [ ] Dashboard de métricas
- [ ] A/B testing

### Fase 4: Expansão 🌟
- [ ] E-commerce completo
- [ ] Sistema de franquias
- [ ] App mobile
- [ ] Integração com marketplaces

## 📚 Recursos Adicionais

- [Documentação do Tailwind CSS](https://tailwindcss.com/docs)
- [Documentação do shadcn/ui](https://ui.shadcn.com/)
- [Documentação do Radix UI](https://www.radix-ui.com/)
- [Guia de TypeScript](https://www.typescriptlang.org/docs/)

---

**Última atualização**: Dezembro 2024  
**Versão**: 1.0.0  
**Mantenedor**: Equipe ViralKids 