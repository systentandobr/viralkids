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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Users } from 'lucide-react';
import { useCustomers } from '@/services/queries/customers';

interface CustomerSelectorProps {
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  onCustomerChange: (customer: {
    customerId?: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
  }) => void;
}

export function CustomerSelector({
  customerId,
  customerName,
  customerEmail,
  customerPhone,
  onCustomerChange,
}: CustomerSelectorProps) {
  const [selectionMode, setSelectionMode] = useState<'existing' | 'new'>('existing');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: customersData, isLoading } = useCustomers({
    search: searchTerm || undefined,
  });

  const customers = customersData?.data || [];

  const handleSelectExisting = (selectedCustomerId: string) => {
    const customer = customers.find((c) => c.id === selectedCustomerId);
    if (customer) {
      onCustomerChange({
        customerId: customer.id,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
      });
    }
  };

  const handleNewCustomerChange = (field: string, value: string) => {
    onCustomerChange({
      customerName: field === 'name' ? value : customerName || '',
      customerEmail: field === 'email' ? value : customerEmail || '',
      customerPhone: field === 'phone' ? value : customerPhone || '',
    });
  };

  return (
    <div className='space-y-4'>
      <RadioGroup value={selectionMode} onValueChange={(value: 'existing' | 'new') => setSelectionMode(value)}>
        <div className='flex items-center space-x-2'>
          <RadioGroupItem value='existing' id='existing' />
          <Label htmlFor='existing' className='cursor-pointer flex items-center gap-2'>
            <Users className='w-4 h-4' />
            Selecionar Cliente Existente
          </Label>
        </div>
        <div className='flex items-center space-x-2'>
          <RadioGroupItem value='new' id='new' />
          <Label htmlFor='new' className='cursor-pointer flex items-center gap-2'>
            <UserPlus className='w-4 h-4' />
            Criar Novo Cliente
          </Label>
        </div>
      </RadioGroup>

      {selectionMode === 'existing' ? (
        <div className='space-y-4'>
          <div>
            <Label htmlFor='customer-search'>Buscar Cliente</Label>
            <Input
              id='customer-search'
              placeholder='Digite para buscar clientes...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor='customer-select'>Cliente *</Label>
            <Select
              value={customerId || ''}
              onValueChange={handleSelectExisting}
            >
              <SelectTrigger id='customer-select'>
                <SelectValue placeholder='Selecione um cliente' />
              </SelectTrigger>
              <SelectContent>
                {isLoading ? (
                  <SelectItem value='loading' disabled>
                    Carregando...
                  </SelectItem>
                ) : customers.length === 0 ? (
                  <SelectItem value='empty' disabled>
                    Nenhum cliente encontrado
                  </SelectItem>
                ) : (
                  customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      <div className='flex items-center gap-2'>
                        <span>{customer.name}</span>
                        <Badge variant='outline' className='text-xs'>
                          {customer.email}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {customerId && (
            <Card>
              <CardContent className='pt-4'>
                <div className='space-y-2'>
                  <div>
                    <Label className='text-xs text-muted-foreground'>Nome</Label>
                    <p className='font-medium'>{customerName}</p>
                  </div>
                  <div>
                    <Label className='text-xs text-muted-foreground'>Email</Label>
                    <p className='font-medium'>{customerEmail}</p>
                  </div>
                  {customerPhone && (
                    <div>
                      <Label className='text-xs text-muted-foreground'>Telefone</Label>
                      <p className='font-medium'>{customerPhone}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <div className='space-y-4'>
          <div>
            <Label htmlFor='new-customer-name'>Nome do Cliente *</Label>
            <Input
              id='new-customer-name'
              placeholder='Nome completo'
              value={customerName || ''}
              onChange={(e) => handleNewCustomerChange('name', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor='new-customer-email'>Email *</Label>
            <Input
              id='new-customer-email'
              type='email'
              placeholder='email@exemplo.com'
              value={customerEmail || ''}
              onChange={(e) => handleNewCustomerChange('email', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor='new-customer-phone'>Telefone</Label>
            <Input
              id='new-customer-phone'
              placeholder='(00) 00000-0000'
              value={customerPhone || ''}
              onChange={(e) => handleNewCustomerChange('phone', e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

