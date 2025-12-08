import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Gift,
  Search,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  Award,
  Calendar,
} from 'lucide-react';
import { referralService } from '@/services/referral/referral.service';
import type { Reward } from '@/types/referral.types';
import { useAuthContext } from '@/features/auth';

export const RewardsManagement: React.FC = () => {
  const { user } = useAuthContext();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [filteredRewards, setFilteredRewards] = useState<Reward[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadRewards();
  }, []);

  useEffect(() => {
    filterRewards();
  }, [rewards, searchTerm, statusFilter]);

  const loadRewards = async () => {
    try {
      setIsLoading(true);
      const data = await referralService.getRewards({ userId: user?.id });
      setRewards(data);
    } catch (error) {
      console.error('Erro ao carregar recompensas:', error);
      alert('Erro ao carregar recompensas');
    } finally {
      setIsLoading(false);
    }
  };

  const filterRewards = () => {
    let filtered = [...rewards];

    if (searchTerm) {
      filtered = filtered.filter(
        (r) =>
          r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (r.details?.couponCode && r.details.couponCode.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((r) => r.status === statusFilter);
    }

    setFilteredRewards(filtered);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string; icon: React.ReactNode; label: string }> = {
      paid: {
        className: 'bg-green-500/10 text-green-600 border-green-500/20',
        icon: <CheckCircle className="h-3 w-3" />,
        label: 'Pago',
      },
      pending: {
        className: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
        icon: <Clock className="h-3 w-3" />,
        label: 'Pendente',
      },
      processing: {
        className: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
        icon: <Clock className="h-3 w-3" />,
        label: 'Processando',
      },
      approved: {
        className: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
        icon: <Award className="h-3 w-3" />,
        label: 'Aprovado',
      },
      cancelled: {
        className: 'bg-red-500/10 text-red-600 border-red-500/20',
        icon: <XCircle className="h-3 w-3" />,
        label: 'Cancelado',
      },
      expired: {
        className: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
        icon: <Clock className="h-3 w-3" />,
        label: 'Expirado',
      },
    };

    const statusInfo = variants[status] || {
      className: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
      icon: null,
      label: status,
    };

    return (
      <Badge variant="secondary" className={statusInfo.className}>
        <span className="flex items-center gap-1">
          {statusInfo.icon}
          {statusInfo.label}
        </span>
      </Badge>
    );
  };

  const formatRewardValue = (reward: Reward) => {
    if (reward.type === 'cashback') {
      return `R$ ${reward.value.toFixed(2)}`;
    }
    if (reward.type === 'points') {
      return `${reward.value} pontos`;
    }
    if (reward.type === 'discount') {
      return `${reward.value}% desconto`;
    }
    if (reward.type === 'physical') {
      return `Produto físico`;
    }
    return `${reward.value}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalValue = filteredRewards
    .filter((r) => r.status === 'paid')
    .reduce((sum, r) => sum + (r.type === 'cashback' ? r.value : 0), 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Carregando recompensas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gerenciar Recompensas</h2>
          <p className="text-muted-foreground">
            Visualize e acompanhe todas as suas recompensas
          </p>
        </div>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <div>
              <div className="text-sm text-muted-foreground">Total Recebido</div>
              <div className="text-xl font-bold text-green-600">R$ {totalValue.toFixed(2)}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por ID ou cupom..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('all')}
              >
                Todas
              </Button>
              <Button
                variant={statusFilter === 'paid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('paid')}
              >
                Pagas
              </Button>
              <Button
                variant={statusFilter === 'pending' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('pending')}
              >
                Pendentes
              </Button>
              <Button
                variant={statusFilter === 'processing' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('processing')}
              >
                Processando
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rewards Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recompensas ({filteredRewards.length})</CardTitle>
          <CardDescription>
            Lista de todas as suas recompensas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredRewards.length === 0 ? (
            <div className="text-center py-8">
              <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhuma recompensa encontrada</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all'
                  ? 'Tente ajustar os filtros de busca'
                  : 'Complete indicações para receber recompensas'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Cupom/Código</TableHead>
                  <TableHead>Data de Criação</TableHead>
                  <TableHead>Data de Pagamento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRewards.map((reward) => (
                  <TableRow key={reward.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Gift className="h-4 w-4 text-muted-foreground" />
                        <span className="capitalize">{reward.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{formatRewardValue(reward)}</div>
                      {reward.currency && (
                        <div className="text-sm text-muted-foreground">{reward.currency}</div>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(reward.status)}</TableCell>
                    <TableCell>
                      {reward.details?.couponCode ? (
                        <div className="font-mono text-sm">{reward.details.couponCode}</div>
                      ) : reward.details?.transactionId ? (
                        <div className="font-mono text-sm text-muted-foreground">
                          {reward.details.transactionId}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{formatDate(reward.createdAt)}</div>
                    </TableCell>
                    <TableCell>
                      {reward.processing?.paidAt ? (
                        <div className="text-sm text-green-600">
                          {formatDate(reward.processing.paidAt)}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
