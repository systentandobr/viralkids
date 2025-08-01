import React from 'react';
import { CartItem } from '../types/ecommerce.types';
import { Button } from '@/components/ui/button';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';

interface ShoppingCartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  total: number;
  finishSale: () => void;
}

export const ShoppingCartSidebar: React.FC<ShoppingCartSidebarProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  total,
  finishSale,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-800">
              Carrinho ({totalItems})
            </h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Conteúdo do Carrinho */}
        <div className="flex-1 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="text-gray-300 text-6xl mb-4">🛒</div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                Carrinho vazio
              </h3>
              <p className="text-gray-500 mb-4">
                Adicione produtos ao seu carrinho para continuar
              </p>
              <Button onClick={onClose}>
                Continuar Comprando
              </Button>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {/* Botão Limpar Carrinho */}
              {cart.length > 0 && (
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearCart}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Limpar Carrinho
                  </Button>
                </div>
              )}

              {cart.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
                  className="flex gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  {/* Imagem do Produto */}
                  <img
                    src={item.product.thumbnail}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  />

                  {/* Informações do Produto */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-medium text-gray-800 text-md line-clamp-2">
                        {item.product.name}
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-gray-400 hover:text-red-500 p-1"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <p className="text-xs text-gray-500 mb-2">
                      por {item.product.franchiseName}
                    </p>

                    {/* Opções Selecionadas */}
                    {(item.selectedColor || item.selectedSize) && (
                      <div className="text-xs text-gray-600 mb-2">
                        {item.selectedColor && (
                          <span className="mr-2">Cor: {item.selectedColor}</span>
                        )}
                        {item.selectedSize && (
                          <span>Tamanho: {item.selectedSize}</span>
                        )}
                      </div>
                    )}

                    {/* Preço e Controles */}
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-primary-600">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>

                      {/* Controles de Quantidade */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        
                        <span className="w-8 text-center text-md font-medium">
                          {item.quantity}
                        </span>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stockQuantity}
                          className="w-8 h-8 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Preço unitário */}
                    <div className="text-xs text-gray-500 mt-1">
                      {formatPrice(item.product.price)} cada
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer com Total e Checkout */}
        {cart.length > 0 && (
          <div className="border-t p-6 space-y-4">
            {/* Resumo do Pedido */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal ({totalItems} itens)</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-md text-gray-600">
                <span>Frete</span>
                <span>Calculado no checkout</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary-600">{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="space-y-3">
              <Button className="w-full" size="lg" onClick={() => {
                finishSale();
              }}>
                Finalizar Compra
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={onClose}
              >
                Continuar Comprando
              </Button>
            </div>

            {/* Informações de Segurança */}
            <div className="text-center">
              <p className="text-xs text-gray-500">
                🔒 Compra 100% segura e protegida
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};