import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Tag } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { CategoryService } from '@/services/products/categoryService';
import { ProductCategory } from '@/services/products/types';

interface CategorySelectorProps {
  categoryId?: string;
  categoryName?: string;
  onCategoryChange: (category: {
    categoryId: string;
    categoryName: string;
  }) => void;
}

export function CategorySelector({
  categoryId,
  categoryName,
  onCategoryChange,
}: CategorySelectorProps) {
  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await CategoryService.list();
      if (response.success && response.data) {
        // Normalizar dados: converter _id para id se necessário
        return response.data.map((cat: any) => ({
          ...cat,
          id: cat.id || cat._id, // Usa id se existir, senão usa _id
        }));
      }
      return [];
    },
  });

  const categories: ProductCategory[] = categoriesData || [];

  // Helper para obter o ID da categoria (suporta tanto id quanto _id)
  const getCategoryId = (category: any): string => {
    return category?.id || category?._id || '';
  };

  // Buscar nome da categoria se já estiver selecionada mas não tiver nome
  const selectedCategoryName = categoryName || 
    (categoryId ? categories.find((c) => getCategoryId(c) === categoryId)?.name : undefined);

  const handleSelectCategory = (selectedCategoryId: string) => {
    console.log('handleSelectCategory', selectedCategoryId);
    const category = categories.find((c) => getCategoryId(c) === selectedCategoryId);
    console.log('category', category);
    if (category) {
      const normalizedId = getCategoryId(category);
      onCategoryChange({
        categoryId: normalizedId,
        categoryName: category.name,
      });
    }
  };

  return (
    <div className='space-y-4'>
      <div>
        <Label htmlFor='category-select'>Categoria *</Label>
        <Select
          value={categoryId || ''}
          onValueChange={handleSelectCategory}
        >
          <SelectTrigger id='category-select'>
            <SelectValue placeholder='Selecione uma categoria' />
          </SelectTrigger>
          <SelectContent>
            {isLoading ? (
              <SelectItem value='loading' disabled>
                Carregando...
              </SelectItem>
            ) : categories.length === 0 ? (
              <SelectItem value='empty' disabled>
                Nenhuma categoria encontrada
              </SelectItem>
            ) : (
              categories.map((category) => {
                const catId = getCategoryId(category);
                return (
                  <SelectItem key={catId} value={catId}>
                    <div className='flex items-center gap-2'>
                      <Tag className='w-4 h-4' />
                      <span>{category.name}</span>
                    </div>
                  </SelectItem>
                );
              })
            )}
          </SelectContent>
        </Select>
      </div>

      {categoryId && selectedCategoryName && (
        <Card>
          <CardContent className='pt-4'>
            <div className='space-y-2'>
              <div>
                <Label className='text-xs text-muted-foreground'>Categoria Selecionada</Label>
                <p className='font-medium flex items-center gap-2'>
                  <Tag className='w-4 h-4' />
                  {selectedCategoryName}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

