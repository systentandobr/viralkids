import React from 'react';
import { useRouter, useParams } from '@/router';

const RouteTest: React.FC = () => {
  const { currentPath, navigate } = useRouter();
  const params = useParams();

  const testRoutes = [
    '/',
    '/products',
    '/product/detail/123',
    '/product/detail/456',
    '/franchisees',
    '/auth'
  ];

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Teste de Rotas</h2>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Rota Atual:</h3>
        <p className="text-base bg-gray-100 p-2 rounded">
          <strong>Path:</strong> {currentPath}
        </p>
        <p className="text-base bg-gray-100 p-2 rounded">
          <strong>Parâmetros:</strong> {JSON.stringify(params)}
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Testar Navegação:</h3>
        <div className="flex flex-wrap gap-2">
          {testRoutes.map((route) => (
            <button
              key={route}
              onClick={() => navigate(route)}
              className={`px-3 py-2 text-base rounded ${
                currentPath === route
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {route}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Testar Rotas Dinâmicas:</h3>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((id) => (
            <button
              key={id}
              onClick={() => navigate(`/product/detail/${id}`)}
              className={`px-3 py-2 text-base rounded ${
                currentPath === `/product/detail/${id}`
                  ? 'bg-green-600 text-white'
                  : 'bg-green-200 hover:bg-green-300'
              }`}
            >
              Produto {id}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 p-4 bg-yellow-100 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Debug Info:</h3>
        <pre className="text-sm bg-white p-2 rounded border overflow-x-auto">
{`Rota Atual: ${currentPath}
Parâmetros: ${JSON.stringify(params, null, 2)}
Hash da URL: ${window.location.hash}
Pathname: ${window.location.pathname}
Search: ${window.location.search}`}
        </pre>
      </div>
    </div>
  );
};

export default RouteTest; 