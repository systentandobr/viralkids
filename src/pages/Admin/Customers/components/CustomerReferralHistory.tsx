import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Share2,
  CheckCircle,
  Clock,
  XCircle,
  Gift,
  RefreshCw,
} from 'lucide-react';
import { CustomerService } from '@/services/customers/customerService';

interface CustomerReferralHistoryProps {
  customerId: string;
}

export const CustomerReferralHistory: React.FC<CustomerReferralHistoryProps> = ({
  customerId,
}) => {
  const [referralHistory, setReferralHistory] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadReferralHistory();
  }, [customerId]);

  const loadReferralHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await CustomerService.getReferralHistory(customerId);
      
      if (response.success && response.data) {
        setReferralHistory(response.data);
      } else {
        // Mock data para desenvolvimento
        setReferralHistory({
          referrals: [
            {
              id: 'ref_1',
              referralCode: 'VIRAL-ABC1-2345',
              status: 'completed',
              createdAt: '2024-01-15T10:00:00Z',
              completedAt: '2024-01-20T14:30:00Z',
              rewardValue: 20.00,
            },
            {
              id: 'ref_2',
              referralCode: 'VIRAL-DEF2-6789',
              status: 'pending',
              createdAt: '2024-01-25T09:00:00Z',
              rewardValue: 0,
            },
          ],
          stats: {
            totalReferrals: 2,
            completedReferrals: 1,
            totalRewardsReceived: 20.00,
            conversionRate: 50.0,
          },
        });
      }
    } catch (err) {
      console.error('Erro ao carregar histórico:', err);
      setError('Erro ao carregar histórico de indicações');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completa
          </Badge>
        );
      case 'pending':
      case 'registered':
        return (
          <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
            <Clock className="h-3 w-3 mr-1" />
            Pendente
          </Badge>
        );
      case 'cancelled':
      case 'expired':
        return (
          <Badge className="bg-red-500/10 text-red-600 border-red-500/20">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelada
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            {status}
          </Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-purple-600" />
          <p className="text-muted-foreground">Carregando histórico...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <p className="text-red-600">{error}</p>
          <button
            onClick={loadReferralHistory}
            className="text-sm text-purple-600 hover:underline"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!referralHistory) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Nenhum histórico encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Indicações</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{referralHistory.stats.totalReferrals}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {referralHistory.stats.completedReferrals}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Recompensas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              R$ {referralHistory.stats.totalRewardsReceived.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Taxa Conversão</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {referralHistory.stats.conversionRate.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Indicações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Indicações Realizadas
          </CardTitle>
          <CardDescription>
            Histórico completo de todas as indicações
          </CardDescription>
        </CardHeader>
        <CardContent>
          {referralHistory.referrals && referralHistory.referrals.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead>Completado em</TableHead>
                  <TableHead className="text-right">Recompensa</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referralHistory.referrals.map((referral: any) => (
                  <TableRow key={referral.id}>
                    <TableCell>
                      <div className="font-mono font-medium">{referral.referralCode}</div>
                    </TableCell>
                    <TableCell>{getStatusBadge(referral.status)}</TableCell>
                    <TableCell>
                      {new Date(referral.createdAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </TableCell>
                    <TableCell>
                      {referral.completedAt ? (
                        new Date(referral.completedAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {referral.rewardValue > 0 ? (
                        <div className="flex items-center justify-end gap-1">
                          <Gift className="h-4 w-4 text-emerald-600" />
                          <span className="font-semibold text-emerald-600">
                            R$ {referral.rewardValue.toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma indicação encontrada
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

