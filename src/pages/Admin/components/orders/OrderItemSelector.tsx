import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, ShoppingCart } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ProductService } from '@/services/products/productService';
import { Product } from '@/services/products/types';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

interface OrderItemSelectorProps {
  items: OrderItem[];
  onItemsChange: (items: OrderItem[]) => void;
}

export function OrderItemSelector({ items, onItemsChange }: OrderItemSelectorProps) {
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState('');

  // Buscar produtos disponíveis
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', 'for-order'],
    queryFn: async () => {
      const response = await ProductService.listProducts({ search: searchTerm });
      if (!response.success) throw new Error(response.error || 'Erro ao buscar produtos');
      return response.data || [];
    },
  });

  const products = productsData || [];

  const handleAddItem = () => {
    if (!selectedProductId) return;

    const product = products.find((p) => p.id === selectedProductId);
    if (!product) return;

    const price = product.price || 0;
    const newItem: OrderItem = {
      productId: product.id,
      productName: product.name,
      quantity,
      price,
      total: price * quantity,
    };

    onItemsChange([...items, newItem]);
    setSelectedProductId('');
    setQuantity(1);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onItemsChange(newItems);
  };

  const handleUpdateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    const newItems = [...items];
    newItems[index].quantity = newQuantity;
    newItems[index].total = newItems[index].price * newQuantity;
    onItemsChange(newItems);
  };

  const handleUpdatePrice = (index: number, newPrice: number) => {
    if (newPrice < 0) return;
    const newItems = [...items];
    newItems[index].price = newPrice;
    newItems[index].total = newPrice * newItems[index].quantity;
    onItemsChange(newItems);
  };

  const total = items.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className='space-y-4'>
      {/* Adicionar novo item */}
      <Card>
        <CardContent className='pt-6'>
          <div className='space-y-4'>
            <div>
              <Label htmlFor='product-search'>Buscar Produto</Label>
              <Input
                id='product-search'
                placeholder='Digite para buscar produtos...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className='grid grid-cols-3 gap-4'>
              <div>
                <Label htmlFor='product-select'>Produto *</Label>
                <Select value={selectedProductId || ''} onValueChange={setSelectedProductId}>
                  <SelectTrigger id='product-select'>
                    <SelectValue placeholder='Selecione um produto' />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoading ? (
                      <SelectItem value='loading' disabled>
                        Carregando...
                      </SelectItem>
                    ) : products.length === 0 ? (
                      <SelectItem value='empty' disabled>
                        Nenhum produto encontrado
                      </SelectItem>
                    ) : (
                      products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} - R$ {product.price?.toFixed(2) || '0.00'}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor='quantity'>Quantidade *</Label>
                <Input
                  id='quantity'
                  type='number'
                  min='1'
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                />
              </div>

              <div className='flex items-end'>
                <Button
                  type='button'
                  onClick={handleAddItem}
                  disabled={!selectedProductId || isLoading}
                  className='w-full'
                >
                  <Plus className='w-4 h-4 mr-2' />
                  Adicionar
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de itens */}
      {items.length === 0 ? (
        <Card>
          <CardContent className='pt-6'>
            <div className='text-center py-8 text-muted-foreground'>
              <ShoppingCart className='w-12 h-12 mx-auto mb-2 opacity-50' />
              <p>Nenhum item adicionado. Adicione produtos ao pedido acima.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className='space-y-2'>
          <Label>Itens do Pedido ({items.length})</Label>
          {items.map((item, index) => (
            <Card key={index}>
              <CardContent className='pt-4'>
                <div className='flex items-start justify-between'>
                  <div className='flex-1 space-y-2'>
                    <div className='flex items-center gap-2'>
                      <Badge variant='outline'>{item.productName}</Badge>
                    </div>
                    <div className='grid grid-cols-3 gap-4'>
                      <div>
                        <Label className='text-xs text-muted-foreground'>Quantidade</Label>
                        <Input
                          type='number'
                          min='1'
                          value={item.quantity}
                          onChange={(e) =>
                            handleUpdateQuantity(index, parseInt(e.target.value) || 1)
                          }
                          className='h-8'
                        />
                      </div>
                      <div>
                        <Label className='text-xs text-muted-foreground'>Preço Unit.</Label>
                        <Input
                          type='number'
                          min='0'
                          step='0.01'
                          value={item.price.toFixed(2)}
                          onChange={(e) =>
                            handleUpdatePrice(index, parseFloat(e.target.value) || 0)
                          }
                          className='h-8'
                        />
                      </div>
                      <div>
                        <Label className='text-xs text-muted-foreground'>Total</Label>
                        <div className='h-8 flex items-center font-semibold text-primary'>
                          R$ {item.total.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    onClick={() => handleRemoveItem(index)}
                    className='ml-4 text-destructive hover:text-destructive'
                  >
                    <Trash2 className='w-4 h-4' />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Total */}
      {items.length > 0 && (
        <Card className='bg-primary/5 border-primary/20'>
          <CardContent className='pt-4'>
            <div className='flex justify-between items-center'>
              <span className='text-lg font-semibold'>Total do Pedido:</span>
              <span className='text-2xl font-bold text-primary'>R$ {total.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

