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
  TrendingUp,
  Users,
  Phone,
  Mail,
  MapPin,
  Filter,
  Search,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { useState } from "react";
import { useLeads, useLeadPipelineStats, useUpdateLead } from "@/services/queries/leads";
import { LeadStatus, LeadSource } from "@/services/leads/leadService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const LeadsPipeline = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | undefined>(undefined);
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  
  const { data: leadsData, isLoading, error } = useLeads({
    search: searchTerm || undefined,
    status: statusFilter,
  });

  const { data: stats } = useLeadPipelineStats();
  const updateLead = useUpdateLead();

  const leads = leadsData?.data || [];

  const getStatusBadgeClass = (status: LeadStatus) => {
    switch (status) {
      case LeadStatus.NEW:
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case LeadStatus.CONTACTED:
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20";
      case LeadStatus.QUALIFIED:
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
      case LeadStatus.CONVERTED:
      case LeadStatus.CUSTOMER:
        return "bg-neon-green/10 text-neon-green border-neon-green/20";
      case LeadStatus.LOST:
        return "bg-neon-red/10 text-neon-red border-neon-red/20";
      default:
        return "bg-muted border-border/50";
    }
  };

  const getStatusLabel = (status: LeadStatus) => {
    const labels: Record<LeadStatus, string> = {
      [LeadStatus.NEW]: "Novo",
      [LeadStatus.CONTACTED]: "Contactado",
      [LeadStatus.QUALIFIED]: "Qualificado",
      [LeadStatus.CONVERTED]: "Convertido",
      [LeadStatus.CUSTOMER]: "Cliente",
      [LeadStatus.LOST]: "Perdido",
    };
    return labels[status];
  };

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    try {
      await updateLead.mutateAsync({
        id: leadId,
        data: { status: newStatus },
      });
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const handleAddNote = async () => {
    if (!selectedLead || !noteText.trim()) return;

    try {
      await updateLead.mutateAsync({
        id: selectedLead,
        data: { note: noteText },
      });
      setNoteText("");
      setIsNoteDialogOpen(false);
      setSelectedLead(null);
    } catch (error) {
      console.error("Erro ao adicionar nota:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 lg:p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground">Carregando leads...</p>
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
            <p className="text-red-600">
              Erro ao carregar leads: {error instanceof Error ? error.message : 'Erro desconhecido'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-neon">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Funil de Leads</h1>
            <p className="text-muted-foreground">
              Gerencie o pipeline de atendimento e conversão de leads
            </p>
          </div>
        </div>
      </div>

      {/* Pipeline Stats */}
      <div className="grid md:grid-cols-5 gap-4 mb-8">
        <Card className="p-4 bg-blue-500/10 border-blue-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Novos</p>
              <h3 className="text-2xl font-bold text-blue-600">{stats?.new || 0}</h3>
            </div>
            <Clock className="h-8 w-8 text-blue-600 opacity-50" />
          </div>
        </Card>

        <Card className="p-4 bg-yellow-500/10 border-yellow-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Contactados</p>
              <h3 className="text-2xl font-bold text-yellow-600">{stats?.contacted || 0}</h3>
            </div>
            <Phone className="h-8 w-8 text-yellow-600 opacity-50" />
          </div>
        </Card>

        <Card className="p-4 bg-purple-500/10 border-purple-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Qualificados</p>
              <h3 className="text-2xl font-bold text-purple-600">{stats?.qualified || 0}</h3>
            </div>
            <CheckCircle className="h-8 w-8 text-purple-600 opacity-50" />
          </div>
        </Card>

        <Card className="p-4 bg-neon-green/10 border-neon-green/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Convertidos</p>
              <h3 className="text-2xl font-bold text-neon-green">{stats?.converted || 0}</h3>
            </div>
            <TrendingUp className="h-8 w-8 text-neon-green opacity-50" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Taxa Conversão</p>
              <h3 className="text-2xl font-bold text-purple-600">
                {stats?.conversionRate?.toFixed(1) || '0'}%
              </h3>
            </div>
            <Users className="h-8 w-8 text-purple-600 opacity-50" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, email ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={statusFilter || "all"}
            onValueChange={(value) =>
              setStatusFilter(value === "all" ? undefined : (value as LeadStatus))
            }
          >
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value={LeadStatus.NEW}>Novo</SelectItem>
              <SelectItem value={LeadStatus.CONTACTED}>Contactado</SelectItem>
              <SelectItem value={LeadStatus.QUALIFIED}>Qualificado</SelectItem>
              <SelectItem value={LeadStatus.CONVERTED}>Convertido</SelectItem>
              <SelectItem value={LeadStatus.LOST}>Perdido</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Leads Table */}
      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Origem</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Etapa Pipeline</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="font-medium">{lead.name}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1 text-sm">
                      <Mail className="h-3 w-3" />
                      {lead.email}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {lead.phone}
                    </div>
                    {lead.city && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {lead.city}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    {lead.source === LeadSource.CHATBOT ? 'Chatbot' :
                     lead.source === LeadSource.WEBSITE ? 'Website' :
                     lead.source === LeadSource.WHATSAPP ? 'WhatsApp' :
                     lead.source === LeadSource.FORM ? 'Formulário' : 'Outro'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          lead.score >= 70
                            ? 'bg-neon-green'
                            : lead.score >= 40
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${lead.score}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{lead.score}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Select
                    value={lead.status}
                    onValueChange={(value) => handleStatusChange(lead.id, value as LeadStatus)}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={LeadStatus.NEW}>Novo</SelectItem>
                      <SelectItem value={LeadStatus.CONTACTED}>Contactado</SelectItem>
                      <SelectItem value={LeadStatus.QUALIFIED}>Qualificado</SelectItem>
                      <SelectItem value={LeadStatus.CONVERTED}>Convertido</SelectItem>
                      <SelectItem value={LeadStatus.CUSTOMER}>Cliente</SelectItem>
                      <SelectItem value={LeadStatus.LOST}>Perdido</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getStatusBadgeClass(lead.status)}>
                    {lead.pipeline?.stage || 'new'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedLead(lead.id);
                        setIsNoteDialogOpen(true);
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-purple-500/10 hover:text-purple-500"
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

      {/* Note Dialog */}
      <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Nota</DialogTitle>
            <DialogDescription>
              Adicione uma nota ou observação sobre este lead
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="note">Nota</Label>
              <Textarea
                id="note"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Digite sua nota aqui..."
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsNoteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddNote} disabled={!noteText.trim()}>
                Salvar Nota
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeadsPipeline;

