// Exportações das queries de produtos
export * from './products';

// Exportações dos tipos
export type {
  Product,
  CreateProductDto,
  UpdateProductDto,
  ProductFilters,
} from './products';

// Exportações das query keys
export {
  productKeys,
} from './products';

// Exportações dos hooks
export {
  useProducts,
  useProduct,
  useProductCategories,
  useFeaturedProducts,
  useProductSearch,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useFilteredProducts,
} from './products'; 