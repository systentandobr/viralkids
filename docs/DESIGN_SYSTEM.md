# Design System ViralKids

## 🎨 Visão Geral

O Design System do ViralKids é baseado em uma paleta de cores quentes e acolhedoras, focada em criar uma experiência visual atrativa e confiável para pais e crianças.

## 🌈 Paleta de Cores

### Cores Principais da Marca

```css
/* Cores principais */
--bronze: 25 95% 53%;        /* Cor primária - Laranja vibrante */
--bronze-light: 30 80% 70%;  /* Bronze mais claro */
--bronze-dark: 20 90% 40%;   /* Bronze mais escuro */
--copper: 15 85% 45%;        /* Cor secundária - Cobre */
--gold: 45 95% 60%;          /* Cor de destaque - Dourado */
```

### Cores de Interface

```css
/* Cores de fundo */
--background: 20 20% 98%;    /* Fundo principal - Branco quente */
--card: 25 45% 95%;          /* Fundo de cards */
--popover: 25 45% 95%;       /* Fundo de popovers */

/* Cores de texto */
--foreground: 20 10% 15%;    /* Texto principal */
--muted-foreground: 20 10% 45%; /* Texto secundário */

/* Cores de interação */
--primary: 25 95% 53%;       /* Cor primária (bronze) */
--secondary: 30 80% 85%;     /* Cor secundária */
--accent: 35 90% 60%;        /* Cor de destaque */
--destructive: 0 84.2% 60.2%; /* Cor de erro */

/* Cores de borda */
--border: 25 30% 88%;        /* Bordas sutis */
--input: 25 30% 88%;         /* Bordas de input */
--ring: 25 95% 53%;          /* Foco de elementos */
```

### Uso das Cores

#### Primária (Bronze)
- **Botões principais**: Call-to-actions, ações importantes
- **Links**: Navegação principal
- **Destaques**: Elementos que precisam de atenção

#### Secundária (Copper)
- **Botões secundários**: Ações menos importantes
- **Bordas**: Delimitação de seções
- **Backgrounds**: Variações sutis

#### Destaque (Gold)
- **Promoções**: Preços especiais
- **Badges**: Status importantes
- **Ícones**: Elementos de destaque

## 🎭 Gradientes

### Gradientes Principais

```css
/* Gradiente hero - Principal da marca */
--gradient-hero: linear-gradient(135deg, 
  hsl(25 95% 53%) 0%, 
  hsl(35 90% 60%) 50%, 
  hsl(45 95% 60%) 100%
);

/* Gradiente bronze - Para cards e elementos */
--gradient-bronze: linear-gradient(135deg, 
  hsl(25 95% 53%), 
  hsl(15 85% 45%)
);

/* Gradiente card - Para backgrounds sutis */
--gradient-card: linear-gradient(145deg, 
  hsl(25 45% 95%), 
  hsl(30 40% 92%)
);
```

### Aplicação dos Gradientes

#### Hero Section
```css
.hero-section {
  background: var(--gradient-hero);
  color: white;
}
```

#### Cards de Produto
```css
.product-card {
  background: var(--gradient-card);
  border: 1px solid hsl(var(--border));
}
```

#### Botões Especiais
```css
.btn-special {
  background: var(--gradient-bronze);
  color: white;
  border: none;
}
```

## 📝 Tipografia

### Hierarquia de Texto

```css
/* Títulos */
.text-4xl { font-size: 2.25rem; line-height: 2.5rem; } /* 36px */
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; } /* 30px */
.text-2xl { font-size: 1.5rem; line-height: 2rem; } /* 24px */
.text-xl { font-size: 1.25rem; line-height: 1.75rem; } /* 20px */

/* Corpo de texto */
.text-lg { font-size: 1.125rem; line-height: 1.75rem; } /* 18px */
.text-base { font-size: 1rem; line-height: 1.5rem; } /* 16px */
.text-sm { font-size: 0.875rem; line-height: 1.25rem; } /* 14px */
.text-xs { font-size: 0.75rem; line-height: 1rem; } /* 12px */
```

### Pesos de Fonte

```css
.font-light { font-weight: 300; }   /* Texto fino */
.font-normal { font-weight: 400; }  /* Texto normal */
.font-medium { font-weight: 500; }  /* Texto médio */
.font-semibold { font-weight: 600; } /* Texto semi-negrito */
.font-bold { font-weight: 700; }    /* Texto negrito */
```

### Classes de Tipografia

```css
/* Título principal */
.heading-primary {
  @apply text-4xl font-bold text-foreground;
}

/* Subtítulo */
.heading-secondary {
  @apply text-2xl font-semibold text-foreground;
}

/* Texto de destaque */
.text-highlight {
  @apply text-lg font-medium text-primary;
}

/* Texto secundário */
.text-muted {
  @apply text-base text-muted-foreground;
}
```

## 🎯 Componentes Base

### Botões

#### Variações de Botão
```typescript
interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}
```

#### Exemplos de Uso
```tsx
// Botão primário
<Button variant="default" size="lg">
  Comprar Agora
</Button>

// Botão secundário
<Button variant="secondary">
  Saiba Mais
</Button>

// Botão outline
<Button variant="outline">
  Adicionar ao Carrinho
</Button>
```

### Cards

#### Estrutura de Card
```tsx
<Card className="p-6 shadow-card">
  <CardHeader>
    <CardTitle>Título do Card</CardTitle>
    <CardDescription>Descrição do card</CardDescription>
  </CardHeader>
  <CardContent>
    Conteúdo do card
  </CardContent>
  <CardFooter>
    <Button>Ação</Button>
  </CardFooter>
</Card>
```

### Badges

#### Tipos de Badge
```tsx
// Badge de status
<Badge variant="default">Em Estoque</Badge>

// Badge de promoção
<Badge variant="secondary" className="bg-gold text-white">
  -20%
</Badge>

// Badge de categoria
<Badge variant="outline">Infantil</Badge>
```

## 🎨 Sombras e Efeitos

### Sistema de Sombras

```css
/* Sombra bronze - Para elementos principais */
--shadow-bronze: 0 10px 30px -10px hsl(25 95% 53% / 0.3);

/* Sombra glow - Para elementos destacados */
--shadow-glow: 0 0 40px hsl(35 90% 60% / 0.2);

/* Sombra card - Para cards e containers */
--shadow-card: 0 4px 20px hsl(25 30% 20% / 0.1);
```

### Aplicação de Sombras

```css
/* Card com sombra sutil */
.card {
  box-shadow: var(--shadow-card);
}

/* Botão com sombra bronze */
.btn-primary {
  box-shadow: var(--shadow-bronze);
}

/* Elemento com glow */
.glow-element {
  box-shadow: var(--shadow-glow);
}
```

## 🎭 Animações

### Keyframes Definidos

```css
/* Animação de flutuação */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

/* Animação de pulse com glow */
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px hsl(25 95% 53% / 0.3); }
  50% { box-shadow: 0 0 40px hsl(25 95% 53% / 0.6); }
}
```

### Classes de Animação

```css
/* Aplicação das animações */
.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}
```

## 📱 Responsividade

### Breakpoints

```css
/* Mobile First */
.sm: 640px   /* Tablets pequenos */
.md: 768px   /* Tablets */
.lg: 1024px  /* Desktops pequenos */
.xl: 1280px  /* Desktops */
.2xl: 1536px /* Desktops grandes */
```

### Exemplos de Layout Responsivo

```tsx
// Grid responsivo
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {products.map(product => (
    <ProductCard key={product.id} product={product} />
  ))}
</div>

// Texto responsivo
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
  ViralKids
</h1>

// Espaçamento responsivo
<section className="px-4 md:px-8 lg:px-16 py-8 md:py-12">
  {/* Conteúdo */}
</section>
```

## 🎨 Dark Mode

### Cores do Tema Escuro

```css
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 212.7 26.8% 83.9%;
}
```

## 🎯 Guia de Uso

### Do's and Don'ts

#### ✅ Faça
- Use as cores primárias para elementos importantes
- Mantenha consistência na tipografia
- Aplique sombras sutis para profundidade
- Use gradientes para elementos de destaque
- Mantenha contraste adequado para acessibilidade

#### ❌ Não Faça
- Não use mais de 3 cores principais por seção
- Não misture diferentes famílias de fontes
- Não aplique sombras muito intensas
- Não use gradientes em textos pequenos
- Não ignore o contraste de cores

### Checklist de Implementação

- [ ] Cores seguem a paleta definida
- [ ] Tipografia usa as classes corretas
- [ ] Componentes seguem os padrões do design system
- [ ] Responsividade implementada
- [ ] Dark mode funcionando
- [ ] Animações suaves e apropriadas
- [ ] Acessibilidade considerada

---

**Próximos passos**: Criar biblioteca de componentes, documentar padrões de interação e implementar testes visuais. 