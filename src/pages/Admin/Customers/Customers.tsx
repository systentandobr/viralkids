import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  Filter,
  Download,
  UserPlus,
  Star,
  Share2,
  Award,
  Eye,
  MessageCircle
} from "lucide-react";
import { useState, useMemo } from "react";
import { useCustomers, useCustomerStats, useDeleteCustomer } from "@/services/queries/customers";
import { CreateCustomerForm } from "@/pages/Admin/components/customers/CreateCustomerForm";
import { EditCustomerForm } from "@/pages/Admin/components/customers/EditCustomerForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CustomerReferralHistory } from "./components/CustomerReferralHistory";
import { useCustomerConversations } from "@/services/queries/conversations";
import { ConversationHistory } from "@/pages/Admin/components/leads/ConversationHistory";

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [referralFilter, setReferralFilter] = useState<string>("all"); // "all" | "top" | "with" | "without"
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null);
  const [viewingReferralHistoryId, setViewingReferralHistoryId] = useState<string | null>(null);
  const [viewingConversationsCustomerId, setViewingConversationsCustomerId] = useState<string | null>(null);
  const deleteCustomer = useDeleteCustomer();

  // Buscar clientes da API
  const { data: customersData, isLoading, error } = useCustomers({
    search: searchTerm || undefined,
    status: statusFilter as 'vip' | 'ativo' | 'novo' | undefined,
    topIndicators: referralFilter === 'top' ? true : undefined,
    minReferrals: referralFilter === 'with' ? 1 : undefined,
  });

  const { data: stats } = useCustomerStats();

  const customers = customersData?.data || [];
  
  // Filtrar clientes localmente se necessário
  let filteredCustomers = customers;
  if (referralFilter === 'without') {
    filteredCustomers = customers.filter(c => !c.referralStats || c.referralStats.totalReferrals === 0);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 lg:p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground">Carregando clientes...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6 lg:p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <p className="text-red-600">Erro ao carregar clientes: {error instanceof Error ? error.message : 'Erro desconhecido'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <div id="content" className="min-h-screen p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-neon">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Gerenciamento de Clientes</h1>
            <p className="text-muted-foreground">
              Gerencie sua base de clientes e histórico de compras
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition-opacity shadow-neon"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Cliente
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-base text-muted-foreground">Total Clientes</p>
              <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {stats?.total || customers.length}
              </h2>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-neon-green/10 to-emerald-500/10 border-neon-green/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-green to-emerald-500 flex items-center justify-center">
              <UserPlus className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-base text-muted-foreground">Novos (mês)</p>
              <h2 className="text-2xl font-bold text-neon-green">
                {stats?.new || customers.filter(c => c.status === "novo").length}
              </h2>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Star className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-base text-muted-foreground">Clientes VIP</p>
              <h2 className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {stats?.vip || customers.filter(c => c.status === "vip").length}
              </h2>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-neon-cyan/10 to-neon-blue/10 border-neon-cyan/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-cyan to-neon-blue flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-base text-muted-foreground">Ticket Médio</p>
              <h2 className="text-2xl font-bold text-neon-cyan">
                R$ {stats?.averageTicket 
                  ? stats.averageTicket.toFixed(0)
                  : customers.length > 0 
                    ? (customers.reduce((acc, c) => acc + (c.totalSpent || 0), 0) / customers.length).toFixed(0)
                    : '0'}
              </h2>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, email ou ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background border-border/50 focus:border-purple-500"
            />
          </div>
          <div className="flex gap-2">
            <Select
              value={referralFilter}
              onValueChange={setReferralFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por indicações" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Indicações</SelectItem>
                <SelectItem value="top">Top Indicadores</SelectItem>
                <SelectItem value="with">Com Indicações</SelectItem>
                <SelectItem value="without">Sem Indicações</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2 border-border/50 hover:border-pink-500">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>
      </Card>

      {/* Customers Table */}
      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-muted/50">
              <TableHead className="text-foreground font-semibold">ID</TableHead>
              <TableHead className="text-foreground font-semibold">Nome</TableHead>
              <TableHead className="text-foreground font-semibold">Contato</TableHead>
              <TableHead className="text-foreground font-semibold text-center">Compras</TableHead>
              <TableHead className="text-foreground font-semibold text-right">Total Gasto</TableHead>
              <TableHead className="text-foreground font-semibold text-center">Indicações</TableHead>
              <TableHead className="text-foreground font-semibold text-right">Recompensas</TableHead>
              <TableHead className="text-foreground font-semibold text-center">Status</TableHead>
              <TableHead className="text-foreground font-semibold text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer.id} className="border-border/50 hover:bg-muted/30 transition-colors">
                <TableCell className="font-mono text-base text-muted-foreground">
                  {customer.id}
                </TableCell>
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  <div className="flex flex-col gap-1">
                    <span className="text-base">{customer.email}</span>
                    <span className="text-sm">{customer.phone}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center font-semibold">
                  {customer.totalPurchases || 0}
                </TableCell>
                <TableCell className="text-right font-semibold text-neon-cyan">
                  R$ {(customer.totalSpent || 0).toFixed(2)}
                </TableCell>
                <TableCell className="text-center">
                  {customer.referralStats ? (
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-1">
                        <Share2 className="h-3 w-3 text-muted-foreground" />
                        <span className="font-semibold">{customer.referralStats.totalReferrals}</span>
                      </div>
                      {customer.referralStats.totalReferrals >= 10 && (
                        <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-xs">
                          <Award className="h-2 w-2 mr-1" />
                          Top
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {customer.referralStats.completedReferrals} completadas
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {customer.referralStats ? (
                    <div className="flex flex-col items-end">
                      <span className="font-semibold text-emerald-600">
                        R$ {customer.referralStats.totalRewardsReceived.toFixed(2)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {customer.referralStats.conversionRate.toFixed(1)}% conversão
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="secondary"
                    className={
                      customer.status === "vip"
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                        : customer.status === "ativo"
                        ? "bg-neon-green/10 text-neon-green border-neon-green/20"
                        : "bg-neon-blue/10 text-neon-blue border-neon-blue/20"
                    }
                  >
                    {customer.status === "vip" ? (
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        VIP
                      </span>
                    ) : customer.status === "ativo" ? "Ativo" : "Novo"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {(customer.metadata?.chatbotSessionIds?.length > 0 || customer.metadata?.chatbotSessionId) && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-purple-500/10 hover:text-purple-500"
                        onClick={() => setViewingConversationsCustomerId(customer.id)}
                        title="Ver Conversas"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    )}
                    {customer.referralStats && customer.referralStats.totalReferrals > 0 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-emerald-500/10 hover:text-emerald-500"
                        onClick={() => setViewingReferralHistoryId(customer.id)}
                        title="Ver histórico de indicações"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-purple-500/10 hover:text-purple-500"
                      onClick={() => setEditingCustomerId(customer.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-neon-red/10 hover:text-neon-red"
                      onClick={async () => {
                        if (confirm(`Tem certeza que deseja excluir ${customer.name}?`)) {
                          try {
                            await deleteCustomer.mutateAsync(customer.id);
                          } catch (error) {
                            console.error('Erro ao excluir cliente:', error);
                          }
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Modal de criação */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <CreateCustomerForm
            onSuccess={() => {
              setIsCreateModalOpen(false);
            }}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Modal de edição */}
      {editingCustomerId && (
        <Dialog open={!!editingCustomerId} onOpenChange={(open) => !open && setEditingCustomerId(null)}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <EditCustomerForm
              customerId={editingCustomerId}
              onSuccess={() => {
                setEditingCustomerId(null);
              }}
              onCancel={() => setEditingCustomerId(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Modal de histórico de indicações */}
      {viewingReferralHistoryId && (
        <Dialog open={!!viewingReferralHistoryId} onOpenChange={(open) => !open && setViewingReferralHistoryId(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Histórico de Indicações</DialogTitle>
              <DialogDescription>
                Histórico completo de indicações e recompensas do cliente
              </DialogDescription>
            </DialogHeader>
            <CustomerReferralHistory customerId={viewingReferralHistoryId} />
          </DialogContent>
        </Dialog>
      )}

      {/* Modal de conversas */}
      {viewingConversationsCustomerId && (
        <ConversationHistoryDialog
          customerId={viewingConversationsCustomerId}
          onClose={() => setViewingConversationsCustomerId(null)}
        />
      )}
    </div>
    </>
  );
};

// Componente auxiliar para o modal de conversas
const ConversationHistoryDialog = ({
  customerId,
  onClose,
}: {
  customerId: string;
  onClose: () => void;
}) => {
  const { data, isLoading, error } = useCustomerConversations(customerId);

  return (
    <Dialog open={!!customerId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Histórico de Conversas</DialogTitle>
          <DialogDescription>
            Histórico completo de conversas do chatbot para este cliente
          </DialogDescription>
        </DialogHeader>
        <ConversationHistory
          sessions={data?.sessions || []}
          isLoading={isLoading}
          error={error as Error | null}
        />
      </DialogContent>
    </Dialog>
  );
};

export default Customers;
