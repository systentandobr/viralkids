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
  Share2,
  Search,
  Filter,
  Copy,
  ExternalLink,
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
  User,
  Gift,
} from 'lucide-react';
import { referralService } from '@/services/referral/referral.service';
import type { Referral } from '@/types/referral.types';
import { useAuthContext } from '@/features/auth';

export const ReferralsManagement: React.FC = () => {
  const { user } = useAuthContext();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [filteredReferrals, setFilteredReferrals] = useState<Referral[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadReferrals();
  }, []);

  useEffect(() => {
    filterReferrals();
  }, [referrals, searchTerm, statusFilter]);

  const loadReferrals = async () => {
    try {
      setIsLoading(true);
      const data = await referralService.getReferrals({ userId: user?.id });
      setReferrals(data);
    } catch (error) {
      console.error('Erro ao carregar indicações:', error);
      alert('Erro ao carregar indicações');
    } finally {
      setIsLoading(false);
    }
  };

  const filterReferrals = () => {
    let filtered = [...referrals];

    if (searchTerm) {
      filtered = filtered.filter(
        (r) =>
          r.referralCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((r) => r.status === statusFilter);
    }

    setFilteredReferrals(filtered);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert('Código copiado!');
  };

  const shareReferral = (referral: Referral) => {
    const text = `Use meu código ${referral.referralCode} e ganhe recompensas na AgentSummary! ${referral.shortLink || ''}`;

    if (navigator.share) {
      navigator.share({
        title: 'Indique e Ganhe - AgentSummary',
        text,
        url: referral.shortLink || window.location.href,
      }).catch(() => {
        navigator.clipboard.writeText(text);
        alert('Link copiado!');
      });
    } else {
      navigator.clipboard.writeText(text);
      alert('Link copiado!');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string; icon: React.ReactNode; label: string }> = {
      completed: {
        className: 'bg-green-500/10 text-green-600 border-green-500/20',
        icon: <CheckCircle className="h-3 w-3" />,
        label: 'Completada',
      },
      pending: {
        className: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
        icon: <Clock className="h-3 w-3" />,
        label: 'Pendente',
      },
      registered: {
        className: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
        icon: <User className="h-3 w-3" />,
        label: 'Registrada',
      },
      cancelled: {
        className: 'bg-red-500/10 text-red-600 border-red-500/20',
        icon: <XCircle className="h-3 w-3" />,
        label: 'Cancelada',
      },
      expired: {
        className: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
        icon: <Clock className="h-3 w-3" />,
        label: 'Expirada',
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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Carregando indicações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Gerenciar Indicações</h2>
        <p className="text-muted-foreground">
          Visualize e gerencie todas as suas indicações
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por código..."
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
                variant={statusFilter === 'completed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('completed')}
              >
                Completadas
              </Button>
              <Button
                variant={statusFilter === 'pending' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('pending')}
              >
                Pendentes
              </Button>
              <Button
                variant={statusFilter === 'registered' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('registered')}
              >
                Registradas
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referrals Table */}
      <Card>
        <CardHeader>
          <CardTitle>Indicações ({filteredReferrals.length})</CardTitle>
          <CardDescription>
            Lista de todas as suas indicações
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredReferrals.length === 0 ? (
            <div className="text-center py-8">
              <Share2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhuma indicação encontrada</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all'
                  ? 'Tente ajustar os filtros de busca'
                  : 'Comece compartilhando seus códigos de indicação'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Recompensa</TableHead>
                  <TableHead>Rastreamento</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReferrals.map((referral) => (
                  <TableRow key={referral.id}>
                    <TableCell>
                      <div className="font-mono font-medium">{referral.referralCode}</div>
                      {referral.shortLink && (
                        <div className="text-sm text-muted-foreground">{referral.shortLink}</div>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(referral.status)}</TableCell>
                    <TableCell>
                      {referral.referrerReward ? (
                        <div className="flex items-center gap-1">
                          <Gift className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">
                            {referral.referrerReward.type === 'cashback' && 'R$ '}
                            {referral.referrerReward.value}
                            {referral.referrerReward.type === 'points' && ' pontos'}
                            {referral.referrerReward.status === 'paid' && ' ✓'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {referral.tracking ? (
                        <div className="text-sm space-y-1">
                          {referral.tracking.sharedAt && (
                            <div className="text-muted-foreground">
                              Compartilhado: {formatDate(referral.tracking.sharedAt)}
                            </div>
                          )}
                          {referral.tracking.completedAt && (
                            <div className="text-green-600">
                              Completado: {formatDate(referral.tracking.completedAt)}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{formatDate(referral.createdAt)}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyCode(referral.referralCode)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => shareReferral(referral)}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
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
