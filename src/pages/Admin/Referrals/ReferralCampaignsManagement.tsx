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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Target,
  Plus,
  Search,
  Edit,
  Play,
  Pause,
  BarChart3,
  Calendar,
  Users,
  TrendingUp,
  Filter,
} from 'lucide-react';
import { referralService } from '@/services/referral/referral.service';
import type { ReferralCampaign } from '@/types/referral.types';
import { useAuthContext } from '@/features/auth';

export const ReferralCampaignsManagement: React.FC = () => {
  const { user } = useAuthContext();
  const [campaigns, setCampaigns] = useState<ReferralCampaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<ReferralCampaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCampaign, setSelectedCampaign] = useState<ReferralCampaign | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    loadCampaigns();
  }, []);

  useEffect(() => {
    filterCampaigns();
  }, [campaigns, searchTerm, statusFilter]);

  const loadCampaigns = async () => {
    try {
      setIsLoading(true);
      const data = await referralService.getCampaigns({ franchiseId: user?.unitId });
      setCampaigns(data);
    } catch (error) {
      console.error('Erro ao carregar campanhas:', error);
      alert('Erro ao carregar campanhas');
    } finally {
      setIsLoading(false);
    }
  };

  const filterCampaigns = () => {
    let filtered = [...campaigns];

    if (searchTerm) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.slug.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

    setFilteredCampaigns(filtered);
  };

  const handleActivate = async (id: string) => {
    try {
      await referralService.activateCampaign(id);
      await loadCampaigns();
      alert('Campanha ativada com sucesso!');
    } catch (error) {
      console.error('Erro ao ativar campanha:', error);
      alert('Erro ao ativar campanha');
    }
  };

  const handlePause = async (id: string) => {
    try {
      await referralService.pauseCampaign(id);
      await loadCampaigns();
      alert('Campanha pausada com sucesso!');
    } catch (error) {
      console.error('Erro ao pausar campanha:', error);
      alert('Erro ao pausar campanha');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      active: 'bg-green-500/10 text-green-600 border-green-500/20',
      paused: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
      draft: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
      expired: 'bg-red-500/10 text-red-600 border-red-500/20',
      completed: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    };

    const labels: Record<string, string> = {
      active: 'Ativa',
      paused: 'Pausada',
      draft: 'Rascunho',
      expired: 'Expirada',
      completed: 'Completa',
    };

    return (
      <Badge variant="secondary" className={variants[status] || ''}>
        {labels[status] || status}
      </Badge>
    );
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const formatReward = (reward: ReferralCampaign['referrerReward']) => {
    if (!reward) return '-';
    return `${reward.type === 'cashback' ? 'R$ ' : ''}${reward.value}${
      reward.type === 'points' ? ' pontos' : reward.type === 'discount' ? '% desconto' : ''
    }`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Carregando campanhas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gerenciar Campanhas de Indicação</h2>
          <p className="text-muted-foreground">
            Crie e gerencie campanhas de indicação para seus clientes
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Campanha
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar campanhas..."
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
                variant={statusFilter === 'active' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('active')}
              >
                Ativas
              </Button>
              <Button
                variant={statusFilter === 'paused' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('paused')}
              >
                Pausadas
              </Button>
              <Button
                variant={statusFilter === 'draft' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('draft')}
              >
                Rascunhos
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <CardTitle>Campanhas ({filteredCampaigns.length})</CardTitle>
          <CardDescription>
            Lista de todas as campanhas de indicação
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredCampaigns.length === 0 ? (
            <div className="text-center py-8">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhuma campanha encontrada</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all'
                  ? 'Tente ajustar os filtros de busca'
                  : 'Crie sua primeira campanha de indicação'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Recompensas</TableHead>
                  <TableHead>Métricas</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCampaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{campaign.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {campaign.description.substring(0, 60)}...
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{formatDate(campaign.startDate)}</div>
                        <div className="text-muted-foreground">até {formatDate(campaign.endDate)}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>Indicador: {formatReward(campaign.referrerReward)}</div>
                        {campaign.refereeReward && (
                          <div className="text-muted-foreground">
                            Indicado: {formatReward(campaign.refereeReward)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {campaign.metrics ? (
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {campaign.metrics.totalReferrals} indicações
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <TrendingUp className="h-3 w-3" />
                            {campaign.metrics.conversionRate.toFixed(1)}% conversão
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedCampaign(campaign);
                            setIsDetailsOpen(true);
                          }}
                        >
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                        {campaign.status === 'active' ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handlePause(campaign.id)}
                          >
                            <Pause className="h-4 w-4" />
                          </Button>
                        ) : campaign.status === 'paused' || campaign.status === 'draft' ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleActivate(campaign.id)}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedCampaign && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedCampaign.name}</DialogTitle>
                <DialogDescription>{selectedCampaign.description}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <div className="mt-1">{getStatusBadge(selectedCampaign.status)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Tipo</label>
                    <div className="mt-1">{selectedCampaign.type}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Data de Início</label>
                    <div className="mt-1">{formatDate(selectedCampaign.startDate)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Data de Término</label>
                    <div className="mt-1">{formatDate(selectedCampaign.endDate)}</div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Recompensas</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-muted-foreground">Indicador:</span>
                      <span className="ml-2 font-medium">{formatReward(selectedCampaign.referrerReward)}</span>
                    </div>
                    {selectedCampaign.refereeReward && (
                      <div>
                        <span className="text-sm text-muted-foreground">Indicado:</span>
                        <span className="ml-2 font-medium">
                          {formatReward(selectedCampaign.refereeReward)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {selectedCampaign.metrics && (
                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-2">Métricas</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-muted-foreground">Total de Indicações:</span>
                        <div className="text-lg font-bold">{selectedCampaign.metrics.totalReferrals}</div>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Indicações Completadas:</span>
                        <div className="text-lg font-bold">
                          {selectedCampaign.metrics.completedReferrals}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Taxa de Conversão:</span>
                        <div className="text-lg font-bold">
                          {selectedCampaign.metrics.conversionRate.toFixed(1)}%
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Valor Total de Recompensas:</span>
                        <div className="text-lg font-bold">
                          R$ {selectedCampaign.metrics.totalRewardsValue.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedCampaign.rules && (
                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-2">Regras</h3>
                    <div className="space-y-1 text-sm">
                      {selectedCampaign.rules.minPurchaseValue && (
                        <div>
                          <span className="text-muted-foreground">Valor mínimo de compra:</span>
                          <span className="ml-2">R$ {selectedCampaign.rules.minPurchaseValue}</span>
                        </div>
                      )}
                      {selectedCampaign.rules.maxReferralsPerUser && (
                        <div>
                          <span className="text-muted-foreground">Máximo por usuário:</span>
                          <span className="ml-2">{selectedCampaign.rules.maxReferralsPerUser}</span>
                        </div>
                      )}
                      {selectedCampaign.rules.expirationDays && (
                        <div>
                          <span className="text-muted-foreground">Dias para expirar:</span>
                          <span className="ml-2">{selectedCampaign.rules.expirationDays}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
