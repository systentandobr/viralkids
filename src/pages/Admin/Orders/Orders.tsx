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
  ShoppingCart,
  Plus,
  Search,
  Eye,
  Edit,
  Filter,
  Download,
  Package,
  CheckCircle2,
  Clock,
  XCircle
} from "lucide-react";
import { useState } from "react";
import { useOrders, useOrderStats, useDeleteOrder } from "@/services/queries/orders";
import { CreateOrderForm } from "@/pages/Admin/components/orders/CreateOrderForm";
import { EditOrderForm } from "@/pages/Admin/components/orders/EditOrderForm";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const deleteOrder = useDeleteOrder();

  // Buscar pedidos da API
  const { data: ordersData, isLoading, error } = useOrders({
    search: searchTerm || undefined,
    status: statusFilter as 'processando' | 'enviado' | 'entregue' | 'cancelado' | undefined,
  });

  const { data: stats } = useOrderStats();

  const orders = ordersData?.data || [];
  const filteredOrders = orders; // Já filtrado pela API

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 lg:p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground">Carregando pedidos...</p>
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
            <p className="text-red-600">Erro ao carregar pedidos: {error instanceof Error ? error.message : 'Erro desconhecido'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="content" className="min-h-screen p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-neon">
            <ShoppingCart className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Gerenciamento de Pedidos</h1>
            <p className="text-muted-foreground">
              Acompanhe e gerencie todos os pedidos da sua unidade
            </p>
          </div>
        </div>
        <Button
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 transition-opacity shadow-neon"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Pedido
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 bg-gradient-to-br from-neon-blue/10 to-neon-cyan/10 border-neon-blue/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-blue to-neon-cyan flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-base text-muted-foreground">Total Pedidos</p>
              <h2 className="text-2xl font-bold text-neon-cyan">
                {stats?.total || orders.length}
              </h2>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-base text-muted-foreground">Processando</p>
              <h2 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {stats?.processing || orders.filter(o => o.status === "processando").length}
              </h2>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-neon-green/10 to-emerald-500/10 border-neon-green/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-green to-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-base text-muted-foreground">Entregues</p>
              <h2 className="text-2xl font-bold text-neon-green">
                {stats?.delivered || orders.filter(o => o.status === "entregue").length}
              </h2>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-neon-red/10 to-red-500/10 border-neon-red/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-red to-red-500 flex items-center justify-center">
              <XCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-base text-muted-foreground">Cancelados</p>
              <h2 className="text-2xl font-bold text-neon-red">
                {stats?.cancelled || orders.filter(o => o.status === "cancelado").length}
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
              placeholder="Buscar por cliente ou número do pedido..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background border-border/50 focus:border-orange-500"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 border-border/50 hover:border-orange-500">
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
            <Button variant="outline" className="gap-2 border-border/50 hover:border-red-500">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>
      </Card>

      {/* Orders Table */}
      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-muted/50">
              <TableHead className="text-foreground font-semibold">Pedido</TableHead>
              <TableHead className="text-foreground font-semibold">Cliente</TableHead>
              <TableHead className="text-foreground font-semibold">Data</TableHead>
              <TableHead className="text-foreground font-semibold text-center">Itens</TableHead>
              <TableHead className="text-foreground font-semibold text-right">Total</TableHead>
              <TableHead className="text-foreground font-semibold text-center">Status</TableHead>
              <TableHead className="text-foreground font-semibold text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id} className="border-border/50 hover:bg-muted/30 transition-colors">
                <TableCell className="font-mono text-base font-semibold">
                  {order.orderNumber}
                </TableCell>
                <TableCell className="font-medium">{order.customerName}</TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(order.orderDate).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary" className="bg-muted border-border/50">
                    {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-semibold text-neon-cyan">
                  R$ {order.total.toFixed(2)}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="secondary"
                    className={
                      order.status === "entregue"
                        ? "bg-neon-green/10 text-neon-green border-neon-green/20"
                        : order.status === "processando"
                          ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20"
                          : order.status === "enviado"
                            ? "bg-neon-blue/10 text-neon-blue border-neon-blue/20"
                            : "bg-neon-red/10 text-neon-red border-neon-red/20"
                    }
                  >
                    {order.status === "entregue" && <CheckCircle2 className="h-3 w-3 mr-1 inline" />}
                    {order.status === "processando" && <Clock className="h-3 w-3 mr-1 inline" />}
                    {order.status === "enviado" && <Package className="h-3 w-3 mr-1 inline" />}
                    {order.status === "cancelado" && <XCircle className="h-3 w-3 mr-1 inline" />}
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-orange-500/10 hover:text-orange-500"
                      onClick={() => setEditingOrderId(order.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-orange-500/10 hover:text-orange-500"
                    >
                      <Eye className="h-4 w-4" />
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
          <CreateOrderForm
            onSuccess={() => {
              setIsCreateModalOpen(false);
            }}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Modal de edição */}
      {editingOrderId && (
        <Dialog open={!!editingOrderId} onOpenChange={(open) => !open && setEditingOrderId(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <EditOrderForm
              orderId={editingOrderId}
              onSuccess={() => {
                setEditingOrderId(null);
              }}
              onCancel={() => setEditingOrderId(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Orders;
