import React, { useState } from 'react';
import { DashboardOverviewCard } from '@/features/admin/components/DashboardOverviewCard';
import { LeadsManagement } from '@/features/admin/components/LeadsManagement';
import { SupplierCatalog } from '@/features/suppliers';
import { useAdminDashboard } from '@/features/admin/hooks/useAdminDashboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LayoutDashboard, 
  Users, 
  Building, 
  ShoppingBag, 
  BarChart3,
  Settings,
  Bell,
  UserCircle,
  LogOut,
  RefreshCw
} from 'lucide-react';
import { useAuthContext } from '@/features/auth';
import { useRouter } from '@/router';

export const AdminDashboard: React.FC = () => {
  const {
    dashboard,
    leads,
    loading,
    error,
    lastUpdated,
    updateLeadStatus,
    addLeadNote,
    refreshDashboard
  } = useAdminDashboard({ autoRefresh: true, refreshInterval: 60000 });

  const { logout, user } = useAuthContext();
  const { navigate } = useRouter();

  const [activeTab, setActiveTab] = useState('overview');
  const [maxSuppliers, setMaxSuppliers] = useState(12);
  if (loading && !dashboard) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="text-muted-foreground">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={refreshDashboard}>
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
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
                <h1 className="text-xl font-bold">Viral Kids Admin</h1>
              </div>
              
              {lastUpdated && (
                <Badge variant="outline" className="flex items-center space-x-1">
                  <RefreshCw className="h-3 w-3" />
                  <span>Atualizado: {lastUpdated.toLocaleTimeString()}</span>
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              
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

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="p-4 space-y-2">
            <Button
              variant={activeTab === 'overview' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('overview')}
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            
            <Button
              variant={activeTab === 'leads' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('leads')}
            >
              <Users className="h-4 w-4 mr-2" />
              Leads
              {dashboard && (
                <Badge variant="secondary" className="ml-auto">
                  {dashboard.leads.newToday}
                </Badge>
              )}
            </Button>
            
            <Button
              variant={activeTab === 'franchises' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('franchises')}
            >
              <Building className="h-4 w-4 mr-2" />
              Franquias
              {dashboard && (
                <Badge variant="secondary" className="ml-auto">
                  {dashboard.franchises.active}
                </Badge>
              )}
            </Button>
            
            <Button
              variant={activeTab === 'suppliers' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('suppliers')}
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Fornecedores
            </Button>
            
            <Button
              variant={activeTab === 'analytics' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('analytics')}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6">
          {activeTab === 'overview' && dashboard && (
            <DashboardOverviewCard overview={dashboard.overview} />
          )}

          {activeTab === 'leads' && (
            <LeadsManagement
              leads={leads}
              onUpdateLeadStatus={updateLeadStatus}
              onAddNote={addLeadNote}
            />
          )}

          {activeTab === 'franchises' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">Gerenciamento de Franquias</h2>
                <p className="text-muted-foreground">
                  Sistema de gestão das franquias ativas e seus desempenhos
                </p>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Em Desenvolvimento</CardTitle>
                  <CardDescription>
                    Sistema de gamificação e gestão de tarefas para franqueados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Esta funcionalidade será implementada na próxima fase, incluindo:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-md text-muted-foreground">
                    <li>Dashboard de performance dos franqueados</li>
                    <li>Sistema de gamificação com tarefas e pontuações</li>
                    <li>Gestão de território e exclusividade</li>
                    <li>Métricas de vendas e crescimento</li>
                    <li>Sistema de suporte e treinamento</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'suppliers' && (
            <SupplierCatalog
              title="Gestão de Fornecedores"
              description="Catálogo completo de fornecedores parceiros"
              showFilters={true}
              maxSuppliers={maxSuppliers}
              setMaxSuppliers={setMaxSuppliers}
            />
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">Analytics e Relatórios</h2>
                <p className="text-muted-foreground">
                  Análises detalhadas de performance e tendências
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Métricas de Performance</CardTitle>
                    <CardDescription>
                      Principais indicadores de desempenho
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {dashboard && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {dashboard.performance.websiteTraffic.totalVisits.toLocaleString()}
                            </div>
                            <div className="text-md text-muted-foreground">Visitas do Site</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {dashboard.performance.chatbotMetrics.totalConversations.toLocaleString()}
                            </div>
                            <div className="text-md text-muted-foreground">Conversas Chatbot</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">
                              {dashboard.performance.emailMetrics.openRate.toFixed(1)}%
                            </div>
                            <div className="text-md text-muted-foreground">Taxa Abertura Email</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">
                              {dashboard.performance.socialMedia.instagram.followers.toLocaleString()}
                            </div>
                            <div className="text-md text-muted-foreground">Seguidores Instagram</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Atividade Recente</CardTitle>
                    <CardDescription>
                      Últimas atividades do sistema
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {dashboard && (
                      <div className="space-y-3">
                        {dashboard.recentActivity.slice(0, 5).map((activity) => (
                          <div key={activity.id} className="flex items-start space-x-3">
                            <div className="text-lg">{activity.icon}</div>
                            <div className="flex-1">
                              <p className="text-md font-medium">{activity.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {activity.description}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {activity.timestamp.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
