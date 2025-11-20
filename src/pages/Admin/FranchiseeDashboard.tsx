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
  Package
} from 'lucide-react';
import { useAuthContext } from '@/features/auth';
import { useRouter } from '@/router';
import { useReplenishmentPlan } from '@/features/inventory/hooks/useReplenishment';
import Customers from './Customers/Customers';
import Orders from './Orders/Orders';
import ProductsManagement from './Products/ProductsManagement';

export const FranchiseeDashboard: React.FC = () => {
  // Simulando ID do franqueado logado
  const franchiseeId = 'franchisee_001';
  
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

  const { logout, user } = useAuthContext();

  const [maxSuppliers, setMaxSuppliers] = useState(12);

  const { navigate, currentPath } = useRouter();

  // Detectar a rota atual para destacar o menu correto
  const getActiveTab = (path: string) => {
    if (path === '/dashboard/tasks') return 'tasks';
    if (path === '/dashboard/suppliers') return 'suppliers';
    if (path === '/dashboard/products') return 'products';
    if (path === '/dashboard/analytics') return 'analytics';
    if (path === '/dashboard/leads') return 'leads';
    if (path === '/dashboard/replenishment') return 'replenishment';
    if (path === '/dashboard/training') return 'training';
    if (path === '/dashboard/customers') return 'customers';
    if (path === '/dashboard/orders') return 'orders';
    if (path === '/dashboard/products-management') return 'products-management';
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
                  <span className="text-white font-bold text-sm">VK</span>
                </div>
                <h1 className="text-xl font-bold">Minha Franquia</h1>
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
                <span className="text-md font-medium">{user?.name}</span>
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
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6">
          {activeTab === '/dashboard/overview' && (
            <div className="space-y-6">
              {/* Welcome Section */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold">Bem-vindo à sua Franquia Viral Kids! 🚀</h2>
                  <p className="text-muted-foreground">
                    Acompanhe seu progresso e complete tarefas para evoluir sua franquia
                  </p>
                </div>

                {/* Progress Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <Trophy className="h-5 w-5 text-yellow-500" />
                        <span>Nível Atual</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-3xl font-bold text-yellow-600">
                          Nível {level}
                        </div>
                        <div className="text-md text-muted-foreground">
                          {nextLevelPoints > 0 ? (
                            <>Faltam {nextLevelPoints} pontos para o próximo nível</>
                          ) : (
                            <>Você atingiu o nível máximo!</>
                          )}
                        </div>
                        {nextLevelPoints > 0 && (
                          <Progress 
                            value={(totalPoints / (totalPoints + nextLevelPoints)) * 100} 
                            className="h-2"
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <Target className="h-5 w-5 text-blue-500" />
                        <span>Progresso Geral</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-3xl font-bold text-blue-600">
                          {progress.toFixed(1)}%
                        </div>
                        <div className="text-md text-muted-foreground">
                          {completedTasks.length} de {completedTasks.length + tasks.length} tarefas concluídas
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <Award className="h-5 w-5 text-purple-500" />
                        <span>Conquistas</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-3xl font-bold text-purple-600">
                          {badges.length}
                        </div>
                        <div className="text-md text-muted-foreground">
                          Badges conquistadas
                        </div>
                        <div className="flex space-x-1">
                          {badges.slice(0, 3).map((badge) => (
                            <span key={badge.id} className="text-lg" title={badge.name}>
                              {getBadgeEmoji(badge.type)}
                            </span>
                          ))}
                          {badges.length > 3 && (
                            <span className="text-md text-muted-foreground">
                              +{badges.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
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
                            <div className="text-md text-muted-foreground">{badge.description}</div>
                            <div className="text-xs text-muted-foreground">
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
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Clock className="h-5 w-5" />
                      <span>Próximas Tarefas</span>
                    </CardTitle>
                    <CardDescription>
                      Continue sua jornada completando estas tarefas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {availableTasks.slice(0, 3).map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-start space-x-3">
                            <div className="text-blue-600">
                              {getCategoryIcon(task.category)}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{task.title}</div>
                              <div className="text-md text-muted-foreground mb-2">
                                {task.description}
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge className={getDifficultyColor(task.difficulty)}>
                                  {task.difficulty}
                                </Badge>
                                <Badge variant="outline">
                                  +{task.points} pontos
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <Button onClick={() => handleCompleteTask(task.id)}>
                            <Play className="h-4 w-4 mr-2" />
                            Iniciar
                          </Button>
                        </div>
                      ))}
                    </div>
                    {availableTasks.length > 3 && (
                      <div className="text-center mt-4">
                        <Button variant="outline" onClick={() => setActiveTab('tasks')}>
                          Ver Todas as Tarefas ({availableTasks.length})
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">Central de Tarefas</h2>
                <p className="text-muted-foreground">
                  Complete tarefas para ganhar pontos e evoluir sua franquia
                </p>
              </div>

              <Tabs defaultValue="available">
                <TabsList>
                  <TabsTrigger value="available">
                    Disponíveis ({availableTasks.length})
                  </TabsTrigger>
                  <TabsTrigger value="completed">
                    Concluídas ({completedTasks.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="available" className="space-y-4">
                  {availableTasks.map((task) => (
                    <Card key={task.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="text-blue-600">
                              {getCategoryIcon(task.category)}
                            </div>
                            <div>
                              <CardTitle className="text-lg">{task.title}</CardTitle>
                              <CardDescription>{task.description}</CardDescription>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <Badge className={getDifficultyColor(task.difficulty)}>
                              {task.difficulty}
                            </Badge>
                            <Badge variant="outline">
                              +{task.points} pontos
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Instruções:</h4>
                          <p className="text-md text-muted-foreground">{task.instructions}</p>
                        </div>
                        
                        {task.resources.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2">Recursos:</h4>
                            <div className="space-y-2">
                              {task.resources.map((resource) => (
                                <div key={resource.id} className="flex items-center space-x-2 text-sm">
                                  <ExternalLink className="h-4 w-4 text-blue-600" />
                                  <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    {resource.title}
                                  </a>
                                  <span className="text-muted-foreground">({resource.type})</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex justify-end">
                          <Button onClick={() => handleCompleteTask(task.id)}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Marcar como Concluída
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {availableTasks.length === 0 && (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">Parabéns!</h3>
                        <p className="text-muted-foreground">
                          Você completou todas as tarefas disponíveis. Novas tarefas serão liberadas em breve!
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="completed" className="space-y-4">
                  {completedTasks.map((task) => (
                    <Card key={task.id} className="bg-green-50 border-green-200">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <div>
                              <CardTitle className="text-lg">{task.title}</CardTitle>
                              <CardDescription>{task.description}</CardDescription>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className="bg-green-100 text-green-800">
                              +{task.points} pontos
                            </Badge>
                            {task.completedAt && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {task.completedAt.toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          )}

          {activeTab === 'suppliers' && (
            <SupplierCatalog
              title="Catálogo de Fornecedores"
              description="Encontre os melhores fornecedores para sua franquia"
              showFilters={true}
              maxSuppliers={maxSuppliers}
              setMaxSuppliers={setMaxSuppliers}
            />
          )}

          {activeTab === 'training' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">Centro de Treinamento</h2>
                <p className="text-muted-foreground">
                  Materiais de apoio e treinamentos para sua franquia
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Instagram className="h-5 w-5 text-pink-600" />
                      <span>Marketing no Instagram</span>
                    </CardTitle>
                    <CardDescription>
                      Como criar conteúdo que vende
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="outline">
                      <Play className="h-4 w-4 mr-2" />
                      Assistir Treinamento
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      <span>Atendimento ao Cliente</span>
                    </CardTitle>
                    <CardDescription>
                      Técnicas de vendas e relacionamento
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Baixar Material
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <ShoppingBag className="h-5 w-5 text-green-600" />
                      <span>Gestão de Produtos</span>
                    </CardTitle>
                    <CardDescription>
                      Como gerenciar seu catálogo
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="outline">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Ler Guia
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

        {activeTab === 'replenishment' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Plano de Reposição</h2>
                <p className="text-muted-foreground">Sugestões automáticas de compra com base no estoque</p>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={() => generate()} disabled={replLoading}>
                  {replLoading ? 'Gerando...' : 'Gerar Plano'}
                </Button>
              </div>
            </div>

            {replError && (
              <Card>
                <CardContent className="p-4 text-destructive text-sm">{replError}</CardContent>
              </Card>
            )}

            {plan && (
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
                          <div className="text-sm text-muted-foreground">Produto: {s.productId}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary">Sugerido: {s.suggestedQty}</Badge>
                          <Badge variant="outline">Motivo: {s.reason}</Badge>
                        </div>
                      </div>
                    ))}
                    {plan.suggestions.length === 0 && (
                      <p className="text-sm text-muted-foreground">Nenhuma sugestão no momento.</p>
                    )}
                  </div>
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
        </main>
      </div>
    </div>
  );
};
