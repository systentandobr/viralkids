import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TrendingUp,
  Users,
  Award,
  Target,
  Share2,
  CheckCircle,
  Clock,
  DollarSign,
  BarChart3,
  Gift,
  Copy,
  ExternalLink
} from 'lucide-react';
import { referralService } from '@/services/referral/referral.service';
import type { ReferralCampaign, Referral, Reward } from '@/types/referral.types';
import { useAuthContext } from '@/features/auth';
import { Input } from '@/components/ui/input';

export const ReferralDashboard: React.FC = () => {
  const { user } = useAuthContext();
  const [activeCampaigns, setActiveCampaigns] = useState<ReferralCampaign[]>([]);
  const [myReferrals, setMyReferrals] = useState<Referral[]>([]);
  const [myRewards, setMyRewards] = useState<Reward[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalReferrals: 0,
    completedReferrals: 0,
    pendingReferrals: 0,
    totalRewardsValue: 0,
    pendingRewards: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [campaigns, referrals, rewards] = await Promise.all([
        referralService.getCampaigns({ status: 'active' }),
        referralService.getReferrals({ userId: user?.id }),
        referralService.getRewards({ userId: user?.id }),
      ]);

      setActiveCampaigns(campaigns);
      setMyReferrals(referrals);
      setMyRewards(rewards);

      // Calcular estatísticas
      const completed = referrals.filter(r => r.status === 'completed').length;
      const pending = referrals.filter(r => r.status === 'pending' || r.status === 'registered').length;
      const totalRewards = rewards
        .filter(r => r.status === 'paid')
        .reduce((sum, r) => sum + (r.value || 0), 0);
      const pendingRewardsCount = rewards.filter(r => r.status === 'pending' || r.status === 'processing').length;

      setStats({
        totalReferrals: referrals.length,
        completedReferrals: completed,
        pendingReferrals: pending,
        totalRewardsValue: totalRewards,
        pendingRewards: pendingRewardsCount,
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os dados do sistema de indicações.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyReferralCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert('Código copiado para a área de transferência!');
  };

  const shareReferral = (referral: Referral) => {
    const text = `Olha que legal! Use meu código ${referral.referralCode} e ganhe recompensas na AgentSummary! ${referral.shortLink || ''}`;

    if (navigator.share) {
      navigator.share({
        title: 'Indique e Ganhe - AgentSummary',
        text,
        url: referral.shortLink || window.location.href,
      }).catch(() => {
        navigator.clipboard.writeText(text);
        alert('Link copiado para compartilhar!');
      });
    } else {
      navigator.clipboard.writeText(text);
      alert('Link copiado para compartilhar!');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Carregando dashboard de indicações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Sistema de Indicações</h2>
        <p className="text-muted-foreground">
          Gerencie suas campanhas, indicações e recompensas
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Indicações</CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReferrals}</div>
            <p className="text-xs text-muted-foreground">
              {stats.completedReferrals} completadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Indicações Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingReferrals}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando conclusão
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recompensas Recebidas</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {stats.totalRewardsValue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingRewards} pendentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Campanhas Ativas</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCampaigns.length}</div>
            <p className="text-xs text-muted-foreground">
              Disponíveis para uso
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList>
          <TabsTrigger value="campaigns">
            Campanhas Ativas ({activeCampaigns.length})
          </TabsTrigger>
          <TabsTrigger value="referrals">
            Minhas Indicações ({myReferrals.length})
          </TabsTrigger>
          <TabsTrigger value="rewards">
            Recompensas ({myRewards.length})
          </TabsTrigger>
        </TabsList>

        {/* Campanhas Ativas */}
        <TabsContent value="campaigns" className="space-y-4">
          {activeCampaigns.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhuma campanha ativa</h3>
                <p className="text-muted-foreground">
                  Não há campanhas de indicação disponíveis no momento.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {activeCampaigns.map((campaign) => (
                <Card key={campaign.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{campaign.name}</CardTitle>
                        <CardDescription className="mt-2">
                          {campaign.description}
                        </CardDescription>
                      </div>
                      <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                        {campaign.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Recompensa do Indicador:</span>
                      <span className="font-medium">
                        {campaign.referrerReward.type === 'cashback' && 'R$ '}
                        {campaign.referrerReward.value}
                        {campaign.referrerReward.type === 'points' && ' pontos'}
                        {campaign.referrerReward.type === 'discount' && '% desconto'}
                      </span>
                    </div>
                    {campaign.refereeReward && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Recompensa do Indicado:</span>
                        <span className="font-medium">
                          {campaign.refereeReward.type === 'cashback' && 'R$ '}
                          {campaign.refereeReward.value}
                          {campaign.refereeReward.type === 'points' && ' pontos'}
                          {campaign.refereeReward.type === 'discount' && '% desconto'}
                        </span>
                      </div>
                    )}
                    {campaign.metrics && (
                      <div className="pt-2 border-t">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Taxa de conversão:</span>
                          <span className="font-medium">{campaign.metrics.conversionRate.toFixed(1)}%</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Minhas Indicações */}
        <TabsContent value="referrals" className="space-y-4">
          {myReferrals.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Share2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhuma indicação ainda</h3>
                <p className="text-muted-foreground mb-4">
                  Comece compartilhando seus códigos de indicação com seus clientes!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {myReferrals.map((referral) => (
                <Card key={referral.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">Código: {referral.referralCode}</CardTitle>
                        <CardDescription className="mt-1">
                          Criado em {new Date(referral.createdAt).toLocaleDateString('pt-BR')}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={
                          referral.status === 'completed'
                            ? 'default'
                            : referral.status === 'pending'
                              ? 'secondary'
                              : 'outline'
                        }
                      >
                        {referral.status === 'completed' && '✓ Completada'}
                        {referral.status === 'pending' && '⏳ Pendente'}
                        {referral.status === 'registered' && '📝 Registrada'}
                        {referral.status === 'cancelled' && '✗ Cancelada'}
                        {referral.status === 'expired' && '⏰ Expirada'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Input
                        value={referral.referralCode}
                        readOnly
                        className="font-mono"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyReferralCode(referral.referralCode)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => shareReferral(referral)}
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Compartilhar
                      </Button>
                    </div>

                    {referral.tracking && (
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {referral.tracking.sharedAt && (
                          <div>
                            <span className="text-muted-foreground">Compartilhado:</span>
                            <p className="font-medium">
                              {new Date(referral.tracking.sharedAt).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        )}
                        {referral.tracking.completedAt && (
                          <div>
                            <span className="text-muted-foreground">Completado:</span>
                            <p className="font-medium">
                              {new Date(referral.tracking.completedAt).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {referral.referrerReward && (
                      <div className="pt-2 border-t">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Sua recompensa:</span>
                          <Badge variant="outline">
                            {referral.referrerReward.type === 'cashback' && 'R$ '}
                            {referral.referrerReward.value}
                            {referral.referrerReward.type === 'points' && ' pontos'}
                            {referral.referrerReward.status === 'paid' && ' ✓ Pago'}
                            {referral.referrerReward.status === 'pending' && ' ⏳ Pendente'}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Recompensas */}
        <TabsContent value="rewards" className="space-y-4">
          {myRewards.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhuma recompensa ainda</h3>
                <p className="text-muted-foreground">
                  Complete indicações para começar a receber recompensas!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {myRewards.map((reward) => (
                <Card key={reward.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {reward.type === 'cashback' && 'Cashback'}
                          {reward.type === 'discount' && 'Desconto'}
                          {reward.type === 'points' && 'Pontos'}
                          {reward.type === 'physical' && 'Produto Físico'}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          Criado em {new Date(reward.createdAt).toLocaleDateString('pt-BR')}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={
                          reward.status === 'paid'
                            ? 'default'
                            : reward.status === 'pending'
                              ? 'secondary'
                              : 'outline'
                        }
                      >
                        {reward.status === 'paid' && '✓ Pago'}
                        {reward.status === 'pending' && '⏳ Pendente'}
                        {reward.status === 'processing' && '⚙️ Processando'}
                        {reward.status === 'approved' && '✓ Aprovado'}
                        {reward.status === 'cancelled' && '✗ Cancelado'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold">
                          {reward.type === 'cashback' && 'R$ '}
                          {reward.value}
                          {reward.type === 'points' && ' pontos'}
                          {reward.type === 'discount' && '%'}
                        </p>
                        {reward.details?.couponCode && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Cupom: {reward.details.couponCode}
                          </p>
                        )}
                      </div>
                      {reward.processing?.paidAt && (
                        <div className="text-right text-sm text-muted-foreground">
                          <p>Pago em:</p>
                          <p className="font-medium">
                            {new Date(reward.processing.paidAt).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
