import React, { useState } from 'react';
import { Lead } from '../types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  Star,
  MessageSquare,
  Eye,
  UserCheck,
  AlertCircle
} from 'lucide-react';

interface LeadsManagementProps {
  leads: Lead[];
  onUpdateLeadStatus: (leadId: string, status: Lead['status']) => void;
  onAddNote: (leadId: string, note: { content: string; authorName: string; type: 'call' | 'email' | 'meeting' | 'note' }) => void;
}

export const LeadsManagement: React.FC<LeadsManagementProps> = ({
  leads,
  onUpdateLeadStatus,
  onAddNote
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [packageFilter, setPackageFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [noteContent, setNoteContent] = useState('');

  // Filtrar leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesPackage = packageFilter === 'all' || lead.franchiseType === packageFilter;
    
    return matchesSearch && matchesStatus && matchesPackage;
  });

  const getStatusBadge = (status: Lead['status']) => {
    const variants = {
      new: { variant: 'destructive' as const, label: 'Novo', icon: AlertCircle },
      contacted: { variant: 'outline' as const, label: 'Contatado', icon: Phone },
      qualified: { variant: 'default' as const, label: 'Qualificado', icon: UserCheck },
      converted: { variant: 'secondary' as const, label: 'Convertido', icon: Star }
    };
    
    const config = variants[status];
    const IconComponent = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center space-x-1">
        <IconComponent className="h-3 w-3" />
        <span>{config.label}</span>
      </Badge>
    );
  };

  const getPackageBadge = (packageType: Lead['franchiseType']) => {
    const colors = {
      starter: 'bg-blue-100 text-blue-800',
      premium: 'bg-purple-100 text-purple-800',
      master: 'bg-gold-100 text-gold-800'
    };
    
    const labels = {
      starter: 'Starter',
      premium: 'Premium',
      master: 'Master'
    };
    
    return (
      <Badge className={colors[packageType]}>
        {labels[packageType]}
      </Badge>
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleStatusChange = (leadId: string, newStatus: Lead['status']) => {
    onUpdateLeadStatus(leadId, newStatus);
  };

  const handleAddNote = () => {
    if (selectedLead && noteContent.trim()) {
      onAddNote(selectedLead.id, {
        content: noteContent,
        authorName: 'Admin', // Em produção, pegar do usuário logado
        type: 'note'
      });
      setNoteContent('');
    }
  };

  const openLeadDetail = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailModalOpen(true);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold">Gerenciamento de Leads</h2>
          <p className="text-muted-foreground">
            {filteredLeads.length} lead(s) encontrado(s)
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline">
            Exportar
          </Button>
          <Button>
            Novo Lead
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtros</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="new">Novo</SelectItem>
                <SelectItem value="contacted">Contatado</SelectItem>
                <SelectItem value="qualified">Qualificado</SelectItem>
                <SelectItem value="converted">Convertido</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={packageFilter} onValueChange={setPackageFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Pacote" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Pacotes</SelectItem>
                <SelectItem value="starter">Starter</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="master">Master</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setPackageFilter('all');
            }}>
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Leads */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Pacote</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id} className="cursor-pointer hover:bg-gray-50">
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{lead.name}</div>
                      <div className="text-md text-muted-foreground">
                        {lead.experience === 'none' && '🆕 Iniciante'}
                        {lead.experience === 'some' && '📈 Alguma exp.'}
                        {lead.experience === 'experienced' && '⭐ Experiente'}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1 text-sm">
                        <Mail className="h-3 w-3" />
                        <span>{lead.email}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm">
                        <Phone className="h-3 w-3" />
                        <span>{lead.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span className="text-sm">{lead.city}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    {getPackageBadge(lead.franchiseType)}
                  </TableCell>
                  
                  <TableCell>
                    <Select 
                      value={lead.status} 
                      onValueChange={(value) => handleStatusChange(lead.id, value as Lead['status'])}
                    >
                      <SelectTrigger className="w-auto border-none p-0 h-auto">
                        {getStatusBadge(lead.status)}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">Novo</SelectItem>
                        <SelectItem value="contacted">Contatado</SelectItem>
                        <SelectItem value="qualified">Qualificado</SelectItem>
                        <SelectItem value="converted">Convertido</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  
                  <TableCell>
                    <div className={`font-medium ${getScoreColor(lead.score)}`}>
                      {lead.score}/100
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-1 text-md text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(lead.createdAt)}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openLeadDetail(lead)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const message = `Olá ${lead.name}! Sou da equipe Viral Kids e gostaria de conversar sobre sua franquia.`;
                          window.open(`https://wa.me/${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
                        }}
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal de Detalhes do Lead */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Lead</DialogTitle>
            <DialogDescription>
              Informações completas e histórico de interações
            </DialogDescription>
          </DialogHeader>
          
          {selectedLead && (
            <div className="space-y-6">
              {/* Informações Principais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Informações Pessoais</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label>Nome</Label>
                      <p className="font-medium">{selectedLead.name}</p>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <p>{selectedLead.email}</p>
                    </div>
                    <div>
                      <Label>Telefone</Label>
                      <p>{selectedLead.phone}</p>
                    </div>
                    <div>
                      <Label>Cidade</Label>
                      <p>{selectedLead.city}</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Informações do Negócio</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label>Pacote de Interesse</Label>
                      <div className="mt-1">
                        {getPackageBadge(selectedLead.franchiseType)}
                      </div>
                    </div>
                    <div>
                      <Label>Experiência</Label>
                      <p>{selectedLead.experience}</p>
                    </div>
                    <div>
                      <Label>Orçamento</Label>
                      <p>{selectedLead.budget}</p>
                    </div>
                    <div>
                      <Label>Prazo para Início</Label>
                      <p>{selectedLead.timeToStart}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Status e Score */}
              <Card>
                <CardHeader>
                  <CardTitle>Status e Pontuação</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-4">
                    <div>
                      <Label>Status Atual</Label>
                      <div className="mt-1">
                        {getStatusBadge(selectedLead.status)}
                      </div>
                    </div>
                    <div>
                      <Label>Score</Label>
                      <p className={`font-bold text-lg ${getScoreColor(selectedLead.score)}`}>
                        {selectedLead.score}/100
                      </p>
                    </div>
                    <div>
                      <Label>Fonte</Label>
                      <p className="capitalize">{selectedLead.source}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Histórico de Notas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>Histórico de Interações</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedLead.notes.length > 0 ? (
                    <div className="space-y-3">
                      {selectedLead.notes.map((note) => (
                        <div key={note.id} className="border-l-4 border-blue-500 pl-4 py-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">{note.authorName}</span>
                            <span className="text-md text-muted-foreground">
                              {formatDate(note.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm">{note.content}</p>
                          <Badge variant="outline" className="mt-1">
                            {note.type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Nenhuma interação registrada</p>
                  )}
                  
                  {/* Adicionar Nova Nota */}
                  <div className="border-t pt-4 space-y-3">
                    <Label>Adicionar Nota</Label>
                    <Textarea
                      placeholder="Digite sua nota sobre a interação..."
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                    />
                    <Button onClick={handleAddNote} disabled={!noteContent.trim()}>
                      Adicionar Nota
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
