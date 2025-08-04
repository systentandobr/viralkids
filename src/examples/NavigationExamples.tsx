import React from 'react';
import { useRouter } from '@/router';
import { useNavigationStore } from '@/stores/additional/navigation.store';

// Exemplo de como navegar com parâmetros ID
const NavigationExamples: React.FC = () => {
  const { navigate } = useRouter();
  const { setSelectedProductId } = useNavigationStore();

  // Exemplo 1: Navegação direta com ID
  const navigateToProduct = (productId: string) => {
    // Usando a rota /product/detail/:id
    setSelectedProductId(productId);
    navigate(`/product/detail/${productId}`);
  };

  // Exemplo 2: Navegação com ID usando rota alternativa
  const navigateToProductAlternative = (productId: string) => {
    // Usando a rota /produto/:id
    navigate(`/produto/${productId}`);
  };

  // Exemplo 3: Navegação com query parameters
  const navigateWithQueryParams = (productId: string) => {
    // Usando query parameters
    navigate(`/product/detail/${productId}?source=search&category=clothing`);
  };

  // Exemplo 4: Navegação com múltiplos parâmetros
  const navigateWithMultipleParams = (productId: string, categoryId: string) => {
    navigate(`/product/detail/${productId}?category=${categoryId}&view=grid`);
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Exemplos de Navegação com ID</h2>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Método 1: Rota com parâmetro dinâmico</h3>
        <button 
          onClick={() => navigateToProduct('123')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Ver Produto ID: 123
        </button>
        <p className="text-sm text-gray-600">
          URL resultante: #/product/detail/123
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Método 2: Rota alternativa</h3>
        <button 
          onClick={() => navigateToProductAlternative('456')}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Ver Produto ID: 456 (Rota Alternativa)
        </button>
        <p className="text-sm text-gray-600">
          URL resultante: #/produto/456
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Método 3: Com query parameters</h3>
        <button 
          onClick={() => navigateWithQueryParams('789')}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Ver Produto ID: 789 com Query Params
        </button>
        <p className="text-sm text-gray-600">
          URL resultante: #/product/detail/789?source=search&category=clothing
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Método 4: Múltiplos parâmetros</h3>
        <button 
          onClick={() => navigateWithMultipleParams('101', 'clothing')}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          Ver Produto ID: 101 da Categoria: clothing
        </button>
        <p className="text-sm text-gray-600">
          URL resultante: #/product/detail/101?category=clothing&view=grid
        </p>
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Como usar o parâmetro ID na página de destino:</h3>
        <pre className="text-sm bg-white p-3 rounded border overflow-x-auto">
{`// No componente ProductDetailPage
import { useParams } from '@/router';

const ProductDetailPage: React.FC = () => {
  const params = useParams();
  const productId = params.id; // Pega o ID da URL
  
  console.log('ID do produto:', productId);
  
  // Usar o ID para carregar dados do produto
  useEffect(() => {
    if (productId) {
      // Carregar produto com o ID
      loadProduct(productId);
    }
  }, [productId]);
  
  return (
    <div>
      <h1>Produto ID: {productId}</h1>
      {/* Resto do conteúdo */}
    </div>
  );
};`}
        </pre>
      </div>
    </div>
  );
};

export default NavigationExamples; 