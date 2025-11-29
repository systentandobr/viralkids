"use client"

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AssistantButton from '@/components/ecommerce/AssistantButton';
import { ProductGrid } from './components/ProductGrid';
import { ProductFilters } from './components/ProductFilters';
import { ShoppingCartSidebar } from './components/ShoppingCartSidebar';
import { FeaturedProducts } from './components/FeaturedProducts';
import { BrandSelector } from './components/BrandSelector';
import { useProducts } from './hooks/useProducts';
import { useCart } from './hooks/useCart';
import { useFilters } from './hooks/useFilters';
import { Product } from './types/ecommerce.types';
import { ShoppingCart, Filter, Grid, List, Star, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EcommerceHeader from '@/components/ecommerce/EcommerceHeader';
import FeaturedBanner from '@/components/ecommerce/FeaturedBanner';
import ProductSection from '@/components/ecommerce/ProductSection';

const EcommercePage: React.FC = () => {
  // Estados do componente
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');

  // Hooks customizados
  const { 
    products, 
    loading, 
    error, 
    categories,
    featuredProducts,
    exclusiveProducts,
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

  // Aplicação de filtros e busca
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

    // Aplicar marca/fornecedor
    if (selectedBrand !== 'all') {
      result = result.filter(product => 
        product.brand.toLowerCase().includes(selectedBrand.toLowerCase()) ||
        product.franchiseId === selectedBrand
      );
    }

    return result;
  }, [filteredProducts, searchQuery, selectedCategory, selectedBrand]);

  // Handlers
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // Scroll suave para a seção de produtos
    const element = document.getElementById('principal-produtos');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleBrandSelect = (brandId: string) => {
    setSelectedBrand(brandId);
    // Scroll suave para a seção de produtos  
    const element = document.getElementById('principal-produtos');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    // TODO: Mostrar toast de sucesso
  };

  const resetAllFilters = () => {
    resetFilters();
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedBrand('all');
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-accent/10">
        <EcommerceHeader 
          cartItemsCount={getCartItemsCount()} 
          setIsCartOpen={setIsCartOpen}
          scrollToSection={scrollToSection}
          />
        
        {/* Hero Banner */}
        <FeaturedBanner />

        <ProductSection />

        
        <main className="container mx-auto px-4 py-8 space-y-12">
          
          {/* Seção de Marcas/Fornecedores */}
          <section>
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                <Star className="h-6 w-6 text-primary" />
                Nossos Parceiros
              </h2>
              <p className="text-gray-600">Produtos exclusivos de franqueados selecionados</p>
            </div>
            <BrandSelector
              selectedBrand={selectedBrand}
              onBrandSelect={handleBrandSelect}
            />
          </section>

          {/* Seção de Produtos em Destaque */}
          {featuredProducts.length > 0 && (
            <section>
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  Produtos em Destaque
                </h2>
                <p className="text-gray-600">Os mais populares da nossa comunidade</p>
              </div>
              <FeaturedProducts 
                products={featuredProducts}
                exclusiveProducts={exclusiveProducts}
                onAddToCart={handleAddToCart}
              />
            </section>
          )}

          {/* Seção Principal de Produtos */}
          <section>
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar de Filtros */}
              <aside className={`lg:w-80 ${isFiltersOpen ? 'block' : 'hidden lg:block'}`}>
                <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                  <ProductFilters
                    filters={filters}
                    onFilterChange={updateFilter}
                    onResetFilters={resetAllFilters}
                    categories={categories}
                  />
                </div>
              </aside>

               {/* Seção de Barra de Pesquisa
                <section className="max-w-md mx-auto">
                  <SearchBar 
                    onSearch={handleSearch}
                    placeholder="Buscar produtos, marcas..."
                  />
                </section>

                {/* Seção de Categorias *}
                <section>
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                      <Grid className="h-6 w-6 text-primary" />
                      Categorias de Produtos
                    </h2>
                    <p className="text-gray-600">Encontre exatamente o que procura</p>
                  </div>
                  <ProductCategories 
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategorySelect={handleCategorySelect}
                  />
                </section> */}

              {/* Área Principal de Produtos */}
              <div id="principal-produtos" className="flex-1">
                
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
                    
                    <div className="flex flex-col">
                      <span className="text-base font-medium text-gray-800">
                        {displayedProducts.length} produto(s)
                      </span>
                      <span className="text-sm text-gray-500">
                        {searchQuery && `Buscando por: "${searchQuery}"`}
                        {selectedCategory !== 'all' && ` • Categoria selecionada`}
                        {selectedBrand !== 'all' && ` • Marca selecionada`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Controles de Visualização */}
                    <div className="flex rounded-lg border">
                      <Button
                        variant={viewMode === 'grid' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                        title="Visualização em grade"
                      >
                        <Grid className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                        title="Visualização em lista"
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
                      <span className="hidden sm:inline">Carrinho</span>
                      {getCartItemsCount() > 0 && (
                        <span className="absolute -top-2 -right-2 bg-accent text-white rounded-full text-sm w-5 h-5 flex items-center justify-center">
                          {getCartItemsCount()}
                        </span>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Grid/Lista de Produtos */}
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-gray-600">Carregando produtos...</p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                    <div className="text-red-400 text-6xl mb-4">⚠️</div>
                    <p className="text-red-600 mb-4 font-medium">Erro ao carregar produtos</p>
                    <p className="text-gray-600 mb-6">Tente novamente em alguns instantes</p>
                    <Button variant="outline" onClick={() => window.location.reload()}>
                      Tentar Novamente
                    </Button>
                  </div>
                ) : displayedProducts.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                    <div className="text-gray-300 text-6xl mb-4">🔍</div>
                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                      Nenhum produto encontrado
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Tente ajustar os filtros ou buscar por outros termos
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Button variant="outline" onClick={resetAllFilters}>
                        Limpar Todos os Filtros
                      </Button>
                      <Button onClick={() => setSearchQuery('')}>
                        Nova Busca
                      </Button>
                    </div>
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
          </section>
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
            setIsCartOpen(false);
          }}
        />

        {/* Assistente Virtual */}
        <AssistantButton />
      </div>
    </>
  );
};

export default EcommercePage;