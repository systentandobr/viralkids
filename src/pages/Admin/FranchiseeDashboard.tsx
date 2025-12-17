import React, { useState, useEffect } from 'react';
import { useGameification } from '@/features/franchise/hooks/useGameification';
import { SupplierCatalog } from '@/features/suppliers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Trophy,
  Target,
  CheckCircle,
  Clock,
  Star,
  Award,
  BookOpen,
  Instagram,
  ShoppingBag,
  TrendingUp,
  Users,
  Calendar,
  Play,
  ExternalLink,
  Download,
  UserCircle,
  LogOut,
  ShoppingCart,
  Package,
  Share2
} from 'lucide-react';
import { useAuthContext } from '@/features/auth';
import { useRouter } from '@/router';
import { useReplenishmentPlan } from '@/features/inventory/hooks/useReplenishment';
import Customers from './Customers/Customers';
import Orders from './Orders/Orders';
import ProductsManagement from './Products/ProductsManagement';
import { CreateReplenishmentForm } from './components/replenishment/CreateReplenishmentForm';
import { FranchiseUsersManager } from './Franchisees/components/FranchiseUsersManager';
import { ReferralsModule } from './Referrals';
import { useUsersByUnitId } from '@/features/users/hooks/useUsersByUnitId';
import { Franchise } from '@/services/franchise/franchiseService';
import { AccessDenied } from '@/components/shared/AccessDenied';
import { isFranchiseeRole, ROLE_CATEGORIES } from '@/features/auth/utils/roleUtils';
import TaskChecklist from '@/components/franchise/TaskChecklist';
import TrainingCenter from '@/components/franchise/TrainingCenter';
import Ranking from '@/components/franchise/Ranking';



export const FranchiseeDashboard: React.FC = () => {

  const { logout, user } = useAuthContext();

  // Simulando ID do unidade logado
  const franchiseeId = user?.unitId;

  const {
    tasks,
    completedTasks,
    badges,
    level,
    totalPoints,
    progress,
    performance,
    isLoading,
    completeTask,
    getAvailableTasks,
    getNextLevelPoints
  } = useGameification({ franchiseeId });


  // Verificar se o usuário tem acesso ao painel de unidade
  const hasAccess = user && isFranchiseeRole(user.role);

  // Se não tem acesso, mostrar mensagem amigável
  if (!hasAccess && user) {
    return (
      <AccessDenied
        title="Acesso ao Painel de unidadeNegado"
        description="Esta área é exclusiva para unidades, gerentes e parceiros. Se você precisa de acesso, entre em contato com o administrador do sistema."
        helpText="Se você é um administrador ou usuário do sistema, acesse o painel administrativo através do menu principal."
        allowedRoles={ROLE_CATEGORIES.FRANCHISEE as string[]}
        showUserRole={true}
        showBackButton={true}
        showHomeButton={true}
        homeUrl="#/admin"
        variant="fullscreen"
        icon="shield"
      />
    );
  }

  // Se não está autenticado, mostrar mensagem de login necessário
  if (!user) {
    return (
      <AccessDenied
        title="Acesso Restrito"
        description="Você precisa estar logado para acessar o painel de unidade."
        showUserRole={false}
        showBackButton={true}
        showHomeButton={true}
        homeUrl="#/login"
        variant="fullscreen"
        icon="lock"
      />
    );
  }

  const [maxSuppliers, setMaxSuppliers] = useState(12);

  const { navigate, currentPath } = useRouter();

  // Detectar a rota atual para destacar o menu correto
  const getActiveTab = (path: string) => {
    if (path === '/dashboard/tasks') return 'tasks';
    if (path === '/dashboard/ranking') return 'ranking';
    if (path === '/dashboard/users') return 'users';
    if (path === '/dashboard/suppliers') return 'suppliers';
    if (path === '/dashboard/products') return 'products';
    if (path === '/dashboard/analytics') return 'analytics';
    if (path === '/dashboard/leads') return 'leads';
    if (path === '/dashboard/replenishment') return 'replenishment';
    if (path === '/dashboard/training') return 'training';
    if (path === '/dashboard/customers') return 'customers';
    if (path === '/dashboard/orders') return 'orders';
    if (path === '/dashboard/products-management') return 'products-management';
    if (path === '/dashboard/referrals') return 'referrals';
    return '/dashboard/overview';
  };

  const [activeTab, setActiveTab] = useState(() => getActiveTab(currentPath));

  // Atualizar activeTab quando a rota mudar
  useEffect(() => {
    const newTab = getActiveTab(currentPath);
    setActiveTab(newTab);
  }, [currentPath]);

  const availableTasks = getAvailableTasks();
  const nextLevelPoints = getNextLevelPoints();

  // Replenishment plan
  const { isLoading: replLoading, error: replError, plan, generate } = useReplenishmentPlan();

  // Buscar usuários da unitId
  const { users: franchiseUsers, isLoading: isLoadingUsers, refetch: refetchUsers } = useUsersByUnitId({
    unitId: user?.unitId,
    enabled: !!user?.unitId && activeTab === 'users',
  });

  const handleCompleteTask = (taskId: string) => {
    completeTask(taskId);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'setup': return <Target className="h-4 w-4" />;
      case 'social_media': return <Instagram className="h-4 w-4" />;
      case 'marketing': return <TrendingUp className="h-4 w-4" />;
      case 'sales': return <ShoppingBag className="h-4 w-4" />;
      case 'training': return <BookOpen className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  // Helper para renderizar ícone da task (resolve problema de serialização do Zustand)
  const renderTaskIcon = (task: any) => {
    // Se o icon existe e é um componente válido, usa ele
    if (task.icon && typeof task.icon === 'function') {
      const IconComponent = task.icon;
      return <IconComponent className="h-6 w-6" style={{ color: task.color }} />;
    }
    // Caso contrário, usa o ícone baseado na categoria
    return getCategoryIcon(task.category);
  };

  const getBadgeEmoji = (type: string) => {
    switch (type) {
      case 'bronze': return '🥉';
      case 'silver': return '🥈';
      case 'gold': return '🥇';
      case 'diamond': return '💎';
      default: return '🏅';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Carregando seu painel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-base">VK</span>
                </div>
                <h1 className="text-xl font-bold">Minha AgentSummary</h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span className="font-medium">Nível {level}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-blue-500" />
                <span className="font-medium">{totalPoints} pontos</span>
              </div>
              <div className="flex items-center space-x-2">
                <UserCircle className="h-6 w-6 text-gray-600" />
                <span className="text-base font-medium">{user?.name}</span>
              </div>

              <Button variant="ghost" size="sm" onClick={() => {
                logout();
                navigate('#/');
              }}>
                <LogOut className="h-4 w-4" /> Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="p-4 space-y-2">
            <Button
              variant={activeTab === '/dashboard/overview' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => {
                setActiveTab('/dashboard/overview');
                navigate('#/dashboard/overview');
              }}
            >
              <Target className="h-4 w-4 mr-2" />
              Visão Geral
            </Button>

            <Button
              variant={activeTab === '/dashboard/tasks' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => {
                setActiveTab('/dashboard/tasks');
                navigate('#/dashboard/tasks');
              }}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Tarefas
              {availableTasks.length > 0 && (
                <Badge variant="secondary" className="ml-auto">
                  {availableTasks.length}
                </Badge>
              )}
            </Button>

            <Button
              variant={activeTab === '/dashboard/ranking' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => {
                setActiveTab('/dashboard/ranking');
                navigate('#/dashboard/ranking');
              }}
            >
              <Trophy className="h-4 w-4 mr-2" />
              Ranking
            </Button>


            <Button
              variant={activeTab === '/dashboard/users' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => {
                setActiveTab('/dashboard/users');
                navigate('#/dashboard/users');
              }}
            >
              <Users className="h-4 w-4 mr-2" />
              Usuários
            </Button>
            <Button
              variant={activeTab === '/dashboard/suppliers' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => {
                setActiveTab('/dashboard/suppliers');
                navigate('#/dashboard/suppliers');
              }}
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Fornecedores
            </Button>

            <Button
              variant={activeTab === '/dashboard/replenishment' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => {
                setActiveTab('/dashboard/replenishment');
                navigate('#/dashboard/replenishment');
              }}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Reposição
            </Button>

            <Button
              variant={activeTab === '/dashboard/training' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => {
                setActiveTab('/dashboard/training');
                navigate('#/dashboard/training');
              }}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Treinamentos
            </Button>

            <Button
              variant={activeTab === '/dashboard/customers' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => {
                setActiveTab('/dashboard/customers');
                navigate('#/dashboard/customers');
              }}
            >
              <Users className="h-4 w-4 mr-2" />
              Clientes
            </Button>

            <Button
              variant={activeTab === 'orders' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => {
                setActiveTab('orders');
                navigate('#/dashboard/orders');
              }}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Pedidos
            </Button>

            <Button
              variant={activeTab === 'products-management' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => {
                setActiveTab('products-management');
                navigate('#/dashboard/products-management');
              }}
            >
              <Package className="h-4 w-4 mr-2" />
              Produtos
            </Button>

            <Button
              variant={activeTab === 'referrals' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => {
                setActiveTab('referrals');
                navigate('#/dashboard/referrals');
              }}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Indicações
            </Button>
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6">
          {activeTab === '/dashboard/overview' && (
            <div className="space-y-6">
              {/* Welcome Section */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold">Bem-vindo à sua AgentSummary! 🚀</h2>
                  <p className="text-muted-foreground">
                    Acompanhe seu progresso e complete tarefas para integração do seu portifólio com nossos agentes
                  </p>
                </div>

                {/* Progress Cards */}
                {/* Stats Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {/* Nível Atual */}
                  <Card className="p-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                        <Trophy className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Nível Atual</p>
                        <h2 className="text-3xl font-bold text-amber-600 dark:text-amber-400">Nível 1</h2>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Faltam <span className="font-semibold text-foreground">100 pontos</span> para o próximo nível
                    </p>
                    <Progress value={0} className="mt-3 h-2" />
                  </Card>

                  {/* Progresso Geral */}
                  <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <Target className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Progresso Geral</p>
                        <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400">0.0%</h2>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">0 de 5</span> tarefas concluídas
                    </p>
                    <Progress value={0} className="mt-3 h-2" />
                  </Card>

                  {/* Conquistas */}
                  <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Award className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Conquistas</p>
                        <h2 className="text-3xl font-bold text-purple-600 dark:text-purple-400">0</h2>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">Badges conquistadas</p>
                  </Card>
                </div>

              </div>



              {/* Recent Badges */}
              {badges.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Award className="h-5 w-5" />
                      <span>Suas Conquistas</span>
                    </CardTitle>
                    <CardDescription>
                      Badges que você conquistou na sua jornada
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {badges.map((badge) => (
                        <div key={badge.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                          <div className="text-2xl">{getBadgeEmoji(badge.type)}</div>
                          <div>
                            <div className="font-medium">{badge.name}</div>
                            <div className="text-base text-muted-foreground">{badge.description}</div>
                            <div className="text-sm text-muted-foreground">
                              {badge.earnedAt instanceof Date
                                ? badge.earnedAt.toLocaleDateString()
                                : new Date(badge.earnedAt).toLocaleDateString()
                              }
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Next Tasks */}
              {availableTasks.length > 0 && (
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Clock className="h-6 w-6 text-primary" />
                    <div>
                      <h2 className="text-2xl font-bold">Próximas Tarefas</h2>
                      <p className="text-sm text-muted-foreground">
                        Continue sua jornada completando estas tarefas
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {tasks.map((task) => (
                      <Card
                        key={task.id}
                        className="p-5 hover:shadow-lg transition-all duration-300 border-l-4"
                        style={{ borderLeftColor: task.color }}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${task.color}20` }}
                          >
                            {renderTaskIcon(task)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg mb-1">{task.title}</h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              {task.description}
                            </p>
                            <div className="flex items-center gap-3">
                              <Badge
                                variant="secondary"
                                className={
                                  task.difficulty === "easy"
                                    ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
                                    : task.difficulty === "medium"
                                      ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20"
                                      : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                                }
                              >
                                {task.difficulty === "easy"
                                  ? "Fácil"
                                  : task.difficulty === "medium"
                                    ? "Médio"
                                    : "Difícil"}
                              </Badge>
                              <Badge
                                variant="secondary"
                                className="bg-primary/10 text-primary border-primary/20"
                              >
                                +{task.points} pontos
                              </Badge>
                            </div>
                          </div>

                          <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity flex-shrink-0">
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Iniciar
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'tasks' && (
            <TaskChecklist franchiseId={franchiseeId} />
          )}

          {activeTab === 'ranking' && (
            <Ranking />
          )}

          {activeTab === 'users' && (
            <>
              {user?.unitId ? (
                <FranchiseUsersManager
                  franchise={{
                    id: user.unitId,
                    unitId: user.unitId,
                    name: user.name || 'Minha AgentSummary',
                    owner: {
                      id: user.id || '',
                      name: user.name || '',
                      email: user.email || '',
                      phone: (user as any).phone,
                    },
                    location: {
                      lat: 0,
                      lng: 0,
                      address: '',
                      city: '',
                      state: '',
                      zipCode: '',
                      type: 'physical',
                    },
                    status: 'active',
                    type: 'standard',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  } as Franchise}
                  onUserAllocated={() => {
                    refetchUsers();
                  }}
                />
              ) : (
                <AccessDenied
                  title="UnitId não configurado"
                  description="Você precisa ter uma unidade (unitId) associada à sua conta para acessar o gerenciamento de usuários."
                  helpText="Entre em contato com o administrador do sistema para associar uma unidade à sua conta."
                  variant="inline"
                  icon="alert"
                  showBackButton={false}
                  showHomeButton={false}
                />
              )}
            </>
          )}

          {activeTab === 'suppliers' && (
            <SupplierCatalog
              title="Catálogo de Fornecedores"
              description="Encontre os melhores fornecedores para sua unidade"
              showFilters={true}
              maxSuppliers={maxSuppliers}
              setMaxSuppliers={setMaxSuppliers}
            />
          )}

          {activeTab === 'training' && (
            <TrainingCenter franchiseId={franchiseeId} />
          )}

          {activeTab === 'replenishment' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Plano de Reposição</h2>
                  <p className="text-muted-foreground">Sugestões automáticas de compra com base no estoque</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button onClick={() => generate()} disabled={replLoading} variant="outline">
                    {replLoading ? 'Gerando...' : 'Gerar Plano'}
                  </Button>
                </div>
              </div>

              {replError && (
                <Card>
                  <CardContent className="p-4 text-destructive text-base">{replError}</CardContent>
                </Card>
              )}

              {plan && plan.suggestions.length > 0 && (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Sugestões ({plan.suggestions.length})</CardTitle>
                      <CardDescription>Gerado em {new Date(plan.generatedAt).toLocaleString()}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {plan.suggestions.map((s) => (
                          <div key={`${s.productId}-${s.sku}`} className="p-3 border rounded flex items-center justify-between">
                            <div>
                              <div className="font-medium">SKU {s.sku}</div>
                              <div className="text-base text-muted-foreground">Produto: {s.productId}</div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant="secondary">Sugerido: {s.suggestedQty}</Badge>
                              <Badge variant="outline">Motivo: {s.reason}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Criar Pedido de Reposição</CardTitle>
                      <CardDescription>
                        Use o assistente para revisar as sugestões e criar um pedido de reposição
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CreateReplenishmentForm
                        onSuccess={() => {
                          // Recarregar plano após criar pedido
                          generate();
                        }}
                      />
                    </CardContent>
                  </Card>
                </div>
              )}

              {plan && plan.suggestions.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Estoque adequado</h3>
                    <p className="text-base text-muted-foreground">
                      Não há necessidade de reposição no momento. Seu estoque está adequado.
                    </p>
                  </CardContent>
                </Card>
              )}

              {!plan && !replLoading && !replError && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Gerar Plano de Reposição</h3>
                    <p className="text-base text-muted-foreground mb-4">
                      Clique no botão acima para gerar sugestões de reposição baseadas no seu estoque atual.
                    </p>
                    <Button onClick={() => generate()} disabled={replLoading}>
                      {replLoading ? 'Gerando...' : 'Gerar Plano'}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'customers' && (
            <Customers />
          )}

          {activeTab === 'orders' && (
            <Orders />
          )}

          {activeTab === 'products-management' && (
            <ProductsManagement />
          )}

          {activeTab === 'referrals' && (
            <ReferralsModule />
          )}
        </main>
      </div>
    </div>
  );
};
