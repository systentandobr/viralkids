import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useCustomers } from '@/services/queries/customers';

interface CustomerSelectorProps {
  value?: string;
  onValueChange: (customerId: string) => void;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
}

export function CustomerSelector({
  value,
  onValueChange,
  searchTerm = '',
  onSearchChange,
}: CustomerSelectorProps) {
  const { data: customersData, isLoading } = useCustomers({
    search: searchTerm || undefined,
  });

  const customers = customersData?.data || [];

  return (
    <div className='space-y-4'>
      {onSearchChange && (
        <div>
          <Label htmlFor='customer-search'>Buscar Cliente</Label>
          <Input
            id='customer-search'
            placeholder='Digite para buscar clientes...'
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      )}

      <div>
        <Label htmlFor='customer-select'>Cliente *</Label>
        <Select value={value || undefined} onValueChange={onValueChange}>
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
    </div>
  );
}

