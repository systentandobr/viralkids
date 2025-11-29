import React from 'react';
import { useFeaturedBrands, useBrandsByPartnershipLevel, useBrandStats } from '@/services/supplier/brands/hooks';
import { Brand } from '@/services/supplier/brands/types';

export const FeaturedBrandsDemo: React.FC = () => {
  const { data: allBrands, isLoading: loadingAll } = useFeaturedBrands();
  const { data: goldBrands, isLoading: loadingGold } = useBrandsByPartnershipLevel('gold');
  const { data: stats } = useBrandStats();

  if (loadingAll || loadingGold) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="text-center text-gray-500">Carregando dados...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Estatísticas das Parcerias</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats?.totalBrands || 0}</div>
            <div className="text-base text-gray-600">Total de Marcas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats?.goldPartners || 0}</div>
            <div className="text-base text-gray-600">Parceiros Gold</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{stats?.silverPartners || 0}</div>
            <div className="text-base text-gray-600">Parceiros Silver</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{stats?.bronzePartners || 0}</div>
            <div className="text-base text-gray-600">Parceiros Bronze</div>
          </div>
        </div>
      </div>

      {/* Marcas Gold */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          🥇 Parceiros Gold ({goldBrands?.length || 0})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goldBrands?.map((brand: Brand) => (
            <div key={brand.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <img src={brand.logo} alt={brand.name} className="w-8 h-8 object-contain" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{brand.name}</h4>
                  <p className="text-base text-gray-600">{brand.description}</p>
                  <p className="text-sm text-gray-500">📍 {brand.location}</p>
                </div>
              </div>
              {brand.instagram && (
                <a 
                  href={brand.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline mt-2 inline-block"
                >
                  📸 Instagram
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Todas as marcas */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Todas as Marcas em Destaque ({allBrands?.length || 0})</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Marca
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Gênero
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Produtos
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Nível
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Localização
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allBrands?.map((brand: Brand) => (
                <tr key={brand.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                        <img src={brand.logo} alt={brand.name} className="w-6 h-6 object-contain" />
                      </div>
                      <div>
                        <div className="text-base font-medium text-gray-900">{brand.name}</div>
                        <div className="text-base text-gray-500">{brand.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900 capitalize">
                    {brand.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">
                    {brand.gender}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">
                    {brand.productCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-sm font-semibold rounded-full ${
                      brand.partnershipLevel === 'gold' ? 'bg-yellow-100 text-yellow-800' :
                      brand.partnershipLevel === 'silver' ? 'bg-gray-100 text-gray-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {brand.partnershipLevel === 'gold' ? '🥇 Gold' :
                       brand.partnershipLevel === 'silver' ? '🥈 Silver' : '🥉 Bronze'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">
                    {brand.location}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}; 