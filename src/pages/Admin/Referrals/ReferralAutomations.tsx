import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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
  Zap,
  Plus,
  Edit,
  Trash2,
  Play,
  Bell,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
} from 'lucide-react';
import { ReferralAutomationService, type AutomationRule, type AutomationRecommendation } from '@/services/referral/referralAutomation.service';
import { useAuthContext } from '@/features/auth';

export const ReferralAutomations: React.FC = () => {
  const { user } = useAuthContext();
  const [automations, setAutomations] = useState<AutomationRule[]>([]);
  const [recommendations, setRecommendations] = useState<AutomationRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingAutomation, setEditingAutomation] = useState<AutomationRule | null>(null);

  useEffect(() => {
    loadData();
  }, [user?.unitId]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [automationsResponse, recommendationsResponse] = await Promise.all([
        ReferralAutomationService.getAutomations({ franchiseId: user?.unitId }),
        ReferralAutomationService.getRecommendations({ franchiseId: user?.unitId }),
      ]);

      if (automationsResponse.success && automationsResponse.data) {
        setAutomations(automationsResponse.data);
      } else {
        // Mock data para desenvolvimento
        setAutomations([
          {
            id: 'auto_1',
            name: 'Campanha de Reativação',
            description: 'Cria campanha automática para clientes inativos há mais de 30 dias',
            trigger: {
              type: 'customer_inactive',
              conditions: { days: 30 },
            },
            action: {
              type: 'create_campaign',
              config: { campaignType: 'reactivation' },
            },
            enabled: true,
            createdAt: '2024-01-01',
            updatedAt: '2024-01-15',
          },
          {
            id: 'auto_2',
            name: 'Onboarding de Novos Clientes',
            description: 'Cria campanha de onboarding para novos clientes',
            trigger: {
              type: 'new_customer',
              conditions: {},
            },
            action: {
              type: 'create_campaign',
              config: { campaignType: 'onboarding' },
            },
            enabled: true,
            createdAt: '2024-01-01',
            updatedAt: '2024-01-15',
          },
        ]);
      }

      if (recommendationsResponse.success && recommendationsResponse.data) {
        setRecommendations(recommendationsResponse.data);
      } else {
        // Mock data para desenvolvimento
        setRecommendations([
          {
            type: 'alert',
            title: 'Lead de Alta Qualidade Aguardando',
            description: '3 leads com score acima de 80 aguardando contato há mais de 24h',
            priority: 'high',
            actionUrl: '/admin/leads',
          },
          {
            type: 'campaign',
            title: 'Campanha com Baixa Conversão',
            description: 'Campanha "Indique e Ganhe" está com conversão abaixo de 50%',
            priority: 'medium',
            actionUrl: '/admin/referrals/campaigns',
          },
          {
            type: 'reward',
            title: 'Recompensas Pendentes',
            description: '12 recompensas pendentes há mais de 7 dias',
            priority: 'medium',
            actionUrl: '/admin/referrals/rewards',
          },
        ]);
      }
    } catch (err) {
      console.error('Erro ao carregar automações:', err);
      setError('Erro ao carregar automações');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleAutomation = async (id: string, enabled: boolean) => {
    try {
      await ReferralAutomationService.updateAutomation(id, { enabled });
      await loadData();
    } catch (err) {
      console.error('Erro ao atualizar automação:', err);
    }
  };

  const handleDeleteAutomation = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta automação?')) return;

    try {
      await ReferralAutomationService.deleteAutomation(id);
      await loadData();
    } catch (err) {
      console.error('Erro ao excluir automação:', err);
    }
  };

  const handleExecuteAutomation = async (id: string) => {
    try {
      await ReferralAutomationService.executeAutomation(id);
      alert('Automação executada com sucesso!');
    } catch (err) {
      console.error('Erro ao executar automação:', err);
      alert('Erro ao executar automação');
    }
  };

  const getTriggerLabel = (type: string) => {
    const labels: Record<string, string> = {
      customer_inactive: 'Cliente Inativo',
      customer_vip: 'Cliente VIP',
      new_customer: 'Novo Cliente',
      low_conversion: 'Baixa Conversão',
      pending_reward: 'Recompensa Pendente',
    };
    return labels[type] || type;
  };

  const getActionLabel = (type: string) => {
    const labels: Record<string, string> = {
      create_campaign: 'Criar Campanha',
      send_notification: 'Enviar Notificação',
      assign_task: 'Atribuir Tarefa',
      update_status: 'Atualizar Status',
    };
    return labels[type] || type;
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return (
          <Badge className="bg-red-500/10 text-red-600 border-red-500/20">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Alta
          </Badge>
        );
      case 'medium':
        return (
          <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
            <Clock className="h-3 w-3 mr-1" />
            Média
          </Badge>
        );
      case 'low':
        return (
          <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
            <CheckCircle className="h-3 w-3 mr-1" />
            Baixa
          </Badge>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-purple-600" />
          <p className="text-muted-foreground">Carregando automações...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={loadData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Automações Inteligentes</h2>
          <p className="text-muted-foreground">
            Configure automações para otimizar o sistema de indicações
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Automação
        </Button>
      </div>

      {/* Recomendações */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Recomendações e Alertas
            </CardTitle>
            <CardDescription>
              Sugestões baseadas em análise do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getPriorityBadge(rec.priority)}
                      <span className="font-medium">{rec.title}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{rec.description}</p>
                  </div>
                  {rec.actionUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        window.location.href = `#${rec.actionUrl}`;
                      }}
                    >
                      Ver
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de Automações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Regras de Automação
          </CardTitle>
          <CardDescription>
            Gerencie suas automações e regras de negócio
          </CardDescription>
        </CardHeader>
        <CardContent>
          {automations.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Trigger</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {automations.map((automation) => (
                  <TableRow key={automation.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{automation.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {automation.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getTriggerLabel(automation.trigger.type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getActionLabel(automation.action.type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={automation.enabled}
                          onCheckedChange={(checked) =>
                            handleToggleAutomation(automation.id, checked)
                          }
                        />
                        <span className="text-sm text-muted-foreground">
                          {automation.enabled ? 'Ativa' : 'Inativa'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleExecuteAutomation(automation.id)}
                          title="Executar agora"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingAutomation(automation)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteAutomation(automation.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma automação configurada
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de criação/edição */}
      {(isCreateModalOpen || editingAutomation) && (
        <Dialog
          open={isCreateModalOpen || !!editingAutomation}
          onOpenChange={(open) => {
            if (!open) {
              setIsCreateModalOpen(false);
              setEditingAutomation(null);
            }
          }}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingAutomation ? 'Editar Automação' : 'Nova Automação'}
              </DialogTitle>
              <DialogDescription>
                Configure uma nova regra de automação para o sistema
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Funcionalidade de criação/edição de automações será implementada em breve.
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setEditingAutomation(null);
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

