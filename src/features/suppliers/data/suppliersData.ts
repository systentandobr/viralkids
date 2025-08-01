// Importar dados dos fornecedores
import pernambucoData from '@/assets/data/fornecedores_pernambuco.json';
import cearaData from '@/assets/data/fornecedores_ceara.json';
import outrosEstadosData from '@/assets/data/fornecedores_outros-estados.json';

// Função para transformar dados do JSON para o formato do Supplier
const transformJsonToSupplier = (jsonData: any) => {
  const id = `supplier_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    id,
    name: jsonData.description?.replace('#IFPE261 - ', '').replace('#IFPE253 - ', '').replace('#IFPE255 - ', '').replace('#IFPE252 - ', '').replace('#IFPE247 - ', '').replace('#IFPE239 - ', '').replace('#IFPE235 - ', '').replace('#IFPE228 - ', '') || 'Fornecedor sem nome',
    description: jsonData.listingDescription || '',
    website: jsonData.website || undefined,
    instagram: jsonData.instagram || undefined,
    location: {
      state: jsonData.estado || '',
      city: extractCity(jsonData.localizacao) || '',
    },
    businessInfo: {
      requiresCNPJ: parseRequiresCNPJ(jsonData.cnpj),
      businessType: 'atacado' as const,
      certifications: []
    },
    products: parseProducts(jsonData),
    policies: parsePolicies(jsonData),
    rating: {
      overall: 4.0 + Math.random() * 1.0,
      quality: 4.0 + Math.random() * 1.0,
      delivery: 4.0 + Math.random() * 1.0,
      service: 4.0 + Math.random() * 1.0,
      value: 4.0 + Math.random() * 1.0,
      totalReviews: Math.floor(Math.random() * 50) + 5
    },
    verified: Math.random() > 0.3,
    featured: Math.random() > 0.8,
    createdAt: new Date(jsonData.createdAt || Date.now()),
    updatedAt: new Date()
  };
};

const extractCity = (localizacao: string): string => {
  if (!localizacao) return '';
  const match = localizacao.match(/Localização:\s*([^-]+)/);
  return match ? match[1].trim() : '';
};

const parseRequiresCNPJ = (cnpjInfo: string): boolean => {
  if (!cnpjInfo) return false;
  return !cnpjInfo.toLowerCase().includes('não');
};

const parseProducts = (jsonData: any): any[] => {
  const categories = [];
  
  if (jsonData.genero) {
    const gender = jsonData.genero.toLowerCase().includes('menino') ? 'meninos' : 
                   jsonData.genero.toLowerCase().includes('menina') ? 'meninas' : 'unissex';
    
    categories.push({
      id: `cat_${Date.now()}`,
      name: 'Roupas Infantis',
      subCategories: ['Camisetas', 'Shorts', 'Vestidos'],
      gender,
      ageGroups: parseSizes(jsonData.tamanho),
      sizes: jsonData.tamanho?.split(',').map((s: string) => s.trim()) || [],
      style: jsonData.estilo?.split(',').map((s: string) => s.trim()) || [],
      priceRange: {
        min: 15.00,
        max: 89.90,
        currency: 'BRL' as const
      }
    });
  }
  
  return categories;
};

const parseSizes = (tamanhoString: string): string[] => {
  if (!tamanhoString) return [];
  
  const sizes = tamanhoString.split(',').map(s => s.trim());
  const ageGroups = [];
  
  for (const size of sizes) {
    const num = parseInt(size);
    if (num <= 2) ageGroups.push('0-6m', '6-12m', '1-2a');
    else if (num <= 4) ageGroups.push('2-4a');
    else if (num <= 6) ageGroups.push('4-6a');
    else if (num <= 8) ageGroups.push('6-8a');
    else if (num <= 10) ageGroups.push('8-10a');
    else if (num <= 12) ageGroups.push('10-12a');
    else if (num <= 14) ageGroups.push('12-14a');
  }
  
  return [...new Set(ageGroups)];
};

const parsePolicies = (jsonData: any): any => {
  const description = jsonData.listingDescription || '';
  
  // Extrair pedido mínimo
  const minOrderMatch = description.match(/Pedido mínimo:\s*(\d+)/);
  const minimumOrder = minOrderMatch ? parseInt(minOrderMatch[1]) : 20;
  
  // Extrair formas de pagamento
  const paymentMethods = ['pix'];
  if (description.toLowerCase().includes('cartão')) {
    paymentMethods.push('credit_card');
  }
  
  return {
    minimumOrder,
    paymentMethods,
    deliveryTime: 7,
    exchangePolicy: true,
    warrantyMonths: 3,
    bulkDiscounts: [
      { minQuantity: 50, discountPercentage: 5 },
      { minQuantity: 100, discountPercentage: 10 }
    ]
  };
};

// Combinar todos os dados
export const getAllSuppliersData = () => {
  const allData = [
    ...pernambucoData,
    ...cearaData,
    ...outrosEstadosData
  ];
  
  return allData.map(transformJsonToSupplier);
};

export const getSuppliersByState = (state: string) => {
  let data;
  switch (state.toLowerCase()) {
    case 'pernambuco':
      data = pernambucoData;
      break;
    case 'ceara':
      data = cearaData;
      break;
    default:
      data = outrosEstadosData;
  }
  
  return data.map(transformJsonToSupplier);
}; 