import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Search,
  ExternalLink,
  RotateCcw,
} from "lucide-react";
import {
  AffiliateProduct,
  ProcessingStatus,
  ProcessingMetrics,
} from "../types";

interface ProcessingStatusTabProps {
  affiliateProducts: AffiliateProduct[];
  onRetry?: (id: string) => Promise<void>;
  onRefresh?: () => Promise<void>;
  isLoading?: boolean;
}

const STATUS_CONFIG: Record<
  ProcessingStatus,
  { label: string; color: string; icon: React.ReactNode }
> = {
  pending: {
    label: "Aguardando",
    color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    icon: <Clock className="h-4 w-4" />,
  },
  processing: {
    label: "Processando",
    color: "bg-neon-blue/10 text-neon-blue border-neon-blue/20",
    icon: <RefreshCw className="h-4 w-4 animate-spin" />,
  },
  completed: {
    label: "Concluído",
    color: "bg-neon-green/10 text-neon-green border-neon-green/20",
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
  failed: {
    label: "Falhou",
    color: "bg-neon-red/10 text-neon-red border-neon-red/20",
    icon: <XCircle className="h-4 w-4" />,
  },
  retrying: {
    label: "Tentando Novamente",
    color: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    icon: <RotateCcw className="h-4 w-4 animate-spin" />,
  },
};

const PLATFORM_LABELS: Record<string, string> = {
  shopee: "Shopee",
  amazon: "Amazon",
  magalu: "Magalu",
  mercadolivre: "Mercado Livre",
  americanas: "Americanas",
  casasbahia: "Casas Bahia",
  other: "Outro",
};

export const ProcessingStatusTab = ({
  affiliateProducts,
  onRetry,
  onRefresh,
  isLoading = false,
}: ProcessingStatusTabProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProcessingStatus | "all">("all");

  const metrics: ProcessingMetrics = useMemo(() => {
    return {
      total: affiliateProducts.length,
      pending: affiliateProducts.filter((p) => p.processingStatus === "pending").length,
      processing: affiliateProducts.filter((p) => p.processingStatus === "processing").length,
      completed: affiliateProducts.filter((p) => p.processingStatus === "completed").length,
      failed: affiliateProducts.filter((p) => p.processingStatus === "failed").length,
      retrying: affiliateProducts.filter((p) => p.processingStatus === "retrying").length,
    };
  }, [affiliateProducts]);

  const filteredProducts = useMemo(() => {
    return affiliateProducts.filter((product) => {
      const matchesSearch =
        product.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.affiliateUrl.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || product.processingStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [affiliateProducts, searchTerm, statusFilter]);

  const handleRetry = async (id: string) => {
    if (onRetry) {
      await onRetry(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Métricas */}
      <div className="grid md:grid-cols-6 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total</div>
          <div className="text-2xl font-bold">{metrics.total}</div>
        </Card>
        <Card className="p-4 bg-yellow-500/10 border-yellow-500/20">
          <div className="text-sm text-yellow-600 dark:text-yellow-400">Aguardando</div>
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {metrics.pending}
          </div>
        </Card>
        <Card className="p-4 bg-neon-blue/10 border-neon-blue/20">
          <div className="text-sm text-neon-blue">Processando</div>
          <div className="text-2xl font-bold text-neon-blue">{metrics.processing}</div>
        </Card>
        <Card className="p-4 bg-neon-green/10 border-neon-green/20">
          <div className="text-sm text-neon-green">Concluídos</div>
          <div className="text-2xl font-bold text-neon-green">{metrics.completed}</div>
        </Card>
        <Card className="p-4 bg-neon-red/10 border-neon-red/20">
          <div className="text-sm text-neon-red">Falhas</div>
          <div className="text-2xl font-bold text-neon-red">{metrics.failed}</div>
        </Card>
        <Card className="p-4 bg-orange-500/10 border-orange-500/20">
          <div className="text-sm text-orange-600 dark:text-orange-400">Tentando</div>
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {metrics.retrying}
          </div>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por categoria ou URL..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="pending">Aguardando</SelectItem>
              <SelectItem value="processing">Processando</SelectItem>
              <SelectItem value="completed">Concluídos</SelectItem>
              <SelectItem value="failed">Falhas</SelectItem>
              <SelectItem value="retrying">Tentando Novamente</SelectItem>
            </SelectContent>
          </Select>
          {onRefresh && (
            <Button variant="outline" onClick={onRefresh} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Atualizar
            </Button>
          )}
        </div>
      </Card>

      {/* Tabela de Produtos */}
      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Categoria</TableHead>
              <TableHead>Plataforma</TableHead>
              <TableHead>URL</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Tentativas</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  Nenhum produto encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => {
                const statusConfig = STATUS_CONFIG[product.processingStatus];
                return (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.categoryName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {PLATFORM_LABELS[product.platform] || product.platform}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <a
                        href={product.affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neon-cyan hover:underline flex items-center gap-1 max-w-xs truncate"
                      >
                        {product.affiliateUrl}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className={statusConfig.color}>
                        <span className="flex items-center gap-1">
                          {statusConfig.icon}
                          {statusConfig.label}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{product.retryCount}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <div className="text-sm">
                        <div>Criado: {new Date(product.createdAt).toLocaleDateString()}</div>
                        {product.processedAt && (
                          <div className="text-xs">
                            Processado: {new Date(product.processedAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {product.processingStatus === "failed" && onRetry && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRetry(product.id)}
                            className="gap-1"
                          >
                            <RotateCcw className="h-3 w-3" />
                            Tentar Novamente
                          </Button>
                        )}
                        {product.errorMessage && (
                          <Button
                            size="sm"
                            variant="ghost"
                            title={product.errorMessage}
                            className="text-destructive"
                          >
                            <AlertCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

