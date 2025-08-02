// Exportações dos componentes do Ecommerce
export { default as EcommercePage } from './EcommercePage';
export { ProductGrid } from './components/ProductGrid';
export { ProductCard } from './components/ProductCard';
export { ProductFilters } from './components/ProductFilters';
export { ProductCategories } from './components/ProductCategories';
export { FeaturedProducts } from './components/FeaturedProducts';
export { SearchBar } from './components/SearchBar';
export { ShoppingCartSidebar } from './components/ShoppingCartSidebar';
export { BrandSelector } from './components/BrandSelector';

// Exportações dos hooks
export { useProducts } from './hooks/useProducts';
export { useCart } from './hooks/useCart';
export { useFilters } from './hooks/useFilters';

// Exportações dos serviços
export { ProductService } from './services/product.service';

// Exportações dos tipos
export type * from './types/ecommerce.types';