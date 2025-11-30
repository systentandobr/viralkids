import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useUpdateOrderStatus, useOrder } from '@/services/queries/orders';
import { Loader2 } from 'lucide-react';

const editOrderSchema = z.object({
  status: z.enum(['processando', 'enviado', 'entregue', 'cancelado']),
  trackingNumber: z.string().optional(),
});

type EditOrderFormData = z.infer<typeof editOrderSchema>;

interface EditOrderFormProps {
  orderId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function EditOrderForm({ orderId, onSuccess, onCancel }: EditOrderFormProps) {
  const { toast } = useToast();
  const updateOrderStatus = useUpdateOrderStatus();
  const { data: order, isLoading } = useOrder(orderId);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<EditOrderFormData>({
    resolver: zodResolver(editOrderSchema),
    defaultValues: {
      status: 'processando',
    },
  });

  useEffect(() => {
    if (order) {
      setValue('status', order.status);
      if (order.trackingNumber) {
        setValue('trackingNumber', order.trackingNumber);
      }
    }
  }, [order, setValue]);

  const onSubmit = async (data: EditOrderFormData) => {
    try {
      await updateOrderStatus.mutateAsync({
        id: orderId,
        data: {
          status: data.status,
          trackingNumber: data.trackingNumber,
        },
      });

      toast({
        title: '✅ Pedido atualizado com sucesso!',
        description: `Status do pedido alterado para ${data.status}`,
      });

      onSuccess?.();
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: '❌ Erro ao atualizar pedido',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className='pt-6'>
          <div className='flex items-center justify-center h-40'>
            <Loader2 className='w-8 h-8 animate-spin text-primary' />
            <span className='ml-2'>Carregando pedido...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!order) {
    return (
      <Card>
        <CardContent className='pt-6'>
          <p className='text-destructive'>Pedido não encontrado</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='w-full max-w-2xl mx-auto'>
      <CardHeader>
        <CardTitle className='text-2xl'>Editar Pedido #{order.orderNumber}</CardTitle>
        <CardDescription>Atualize o status e informações de rastreamento do pedido</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-4'>
            <div>
              <Label htmlFor='status'>Status do Pedido *</Label>
              <Select
                value={watch('status') || ''}
                onValueChange={(value) => {
                  setValue('status', value as EditOrderFormData['status'], { shouldValidate: true, shouldDirty: true });
                }}
              >
                <SelectTrigger id='status'>
                  <SelectValue placeholder='Selecione o status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='processando'>Processando</SelectItem>
                  <SelectItem value='enviado'>Enviado</SelectItem>
                  <SelectItem value='entregue'>Entregue</SelectItem>
                  <SelectItem value='cancelado'>Cancelado</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className='text-base text-destructive mt-1'>{errors.status.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor='trackingNumber'>Código de Rastreamento</Label>
              <Input
                id='trackingNumber'
                {...register('trackingNumber')}
                placeholder='Ex: BR123456789BR'
              />
              {errors.trackingNumber && (
                <p className='text-base text-destructive mt-1'>{errors.trackingNumber.message}</p>
              )}
            </div>

            {/* Informações do pedido (somente leitura) */}
            <div className='pt-4 border-t space-y-2'>
              <div>
                <Label className='text-xs text-muted-foreground'>Cliente</Label>
                <p className='font-medium'>{order.customerName}</p>
              </div>
              <div>
                <Label className='text-xs text-muted-foreground'>Total</Label>
                <p className='font-medium'>R$ {order.total.toFixed(2)}</p>
              </div>
              <div>
                <Label className='text-xs text-muted-foreground'>Itens</Label>
                <p className='font-medium'>{order.items.length} item(ns)</p>
              </div>
            </div>
          </div>

          <div className='flex justify-between pt-4 border-t'>
            <Button type='button' variant='outline' onClick={onCancel}>
              Cancelar
            </Button>
            <Button type='submit' disabled={updateOrderStatus.isPending}>
              {updateOrderStatus.isPending ? (
                <>
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  Salvando...
                </>
              ) : (
                'Salvar Alterações'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

