// Exportações principais da feature de suppliers
export { SupplierCard, SupplierCatalog, SupplierFilter } from './components';
export { useSuppliers } from './hooks/useSuppliers';
export type { 
  Supplier, 
  SupplierFilter as SupplierFilterType,
  SupplierMetrics,
  SupplierLocation,
  BusinessInfo,
  ProductCategory,
  SupplierPolicies,
  SupplierRating,
  SupplierReview,
  SupplierContact
} from './types';
