"use client"

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ProductGrid } from './components/ProductGrid';
import { ProductFilters } from './components/ProductFilters';
import { ShoppingCartSidebar } from './components/ShoppingCartSidebar';
import { ProductCategories } from './components/ProductCategories';
import { FeaturedProducts } from './components/FeaturedProducts';
import { SearchBar } from './components/SearchBar';
import { useProducts } from './hooks/useProducts';
import { useCart } from './hooks/useCart';
import { useFilters } from './hooks/useFilters';
import { Product, ProductCategory } from './types/ecommerce.types';
import { ShoppingCart, Filter, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EcommerceHeader from '@/components/ecommerce/EcommerceHeader';
import FeaturedBanner from '@/components/ecommerce/FeaturedBanner';

const EcommercePage: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const { 
    products, 
    loading, 
    error, 
    categories,
    featuredProducts,
    searchProducts,
    getProductsByCategory
  } = useProducts();

  const { 
    cart, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartTotal,
    getCartItemsCount,
    finishSale,
  } = useCart();

  const {
    filters,
    updateFilter,
    resetFilters,
    filteredProducts
  } = useFilters(products);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Aplicar filtros e busca
  const displayedProducts = React.useMemo(() => {
    let result = filteredProducts;

    // Aplicar busca
    if (searchQuery.trim()) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Aplicar categoria
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }

    return result;
  }, [filteredProducts, searchQuery, selectedCategory]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    // Mostrar feedback visual (toast)
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-accent/10">
        <EcommerceHeader />
        
        {/* Hero Banner */}
        <FeaturedBanner />
        
        <main className="container mx-auto px-4 py-8">
          {/* Hero Section da Loja */}
          {/* <section className="mb-12 text-center py-16 bg-white rounded-2xl shadow-sm">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                Produtos Especiais para seu Pequeno
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Descubra nossa seleção curada de produtos infantis únicos, 
                criados por nossos franqueados com amor e qualidade.
              </p>
              
              {/* Barra de Pesquisa Principal *
              <div className="max-w-md mx-auto">
                <SearchBar 
                  onSearch={handleSearch}
                  placeholder="Buscar produtos..."
                />
              </div>
            </div>
          </section> */}

          {/* Categorias em Destaque */}
          <section className="mb-12">
            <ProductCategories 
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
            />
          </section>

          {/* Produtos em Destaque */}
          {featuredProducts.length > 0 && (
            <section className="mb-12">
              <FeaturedProducts 
                products={featuredProducts}
                onAddToCart={handleAddToCart}
              />
            </section>
          )}

          {/* Controles da Loja */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar de Filtros */}
            <aside className={`lg:w-80 ${isFiltersOpen ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <ProductFilters
                  filters={filters}
                  onFilterChange={updateFilter}
                  onResetFilters={resetFilters}
                  categories={categories}
                />
              </div>
            </aside>

            {/* Área Principal de Produtos */}
            <div className="flex-1">
              {/* Barra de Ferramentas */}
              <div className="flex items-center justify-between mb-6 bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                    className="lg:hidden"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filtros
                  </Button>
                  
                  <span className="text-sm text-gray-600">
                    {displayedProducts.length} produto(s) encontrado(s)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Controles de Visualização */}
                  <div className="flex rounded-lg border">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Botão do Carrinho */}
                  <Button
                    variant="outline"
                    onClick={() => setIsCartOpen(true)}
                    className="relative"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Carrinho
                    {getCartItemsCount() > 0 && (
                      <span className="absolute -top-2 -right-2 bg-accent text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                        {getCartItemsCount()}
                      </span>
                    )}
                  </Button>
                </div>
              </div>

              {/* Grid de Produtos */}
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : error ? (
                <div className="text-center py-20">
                  <p className="text-red-600 mb-4">Erro ao carregar produtos</p>
                  <Button variant="outline" onClick={() => window.location.reload()}>
                    Tentar Novamente
                  </Button>
                </div>
              ) : displayedProducts.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                  <p className="text-gray-600 mb-4">Nenhum produto encontrado</p>
                  <Button variant="outline" onClick={resetFilters}>
                    Limpar Filtros
                  </Button>
                </div>
              ) : (
                <ProductGrid
                  products={displayedProducts}
                  viewMode={viewMode}
                  onAddToCart={handleAddToCart}
                />
              )}
            </div>
          </div>
        </main>

        <Footer />

        {/* Sidebar do Carrinho */}
        <ShoppingCartSidebar
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          onClearCart={clearCart}
          total={getCartTotal()}
          finishSale={() => {
            finishSale();
          }}
        />
      </div>
    </>
  );
};

export default EcommercePage;