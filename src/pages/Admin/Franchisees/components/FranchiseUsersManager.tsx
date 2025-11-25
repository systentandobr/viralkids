import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  X,
  CheckCircle2,
  XCircle,
  Loader2,
  UserPlus,
} from "lucide-react";
import { Franchise } from "@/services/franchise/franchiseService";
import { UserService, User } from "@/services/users/userService";
import { toast } from "sonner";

// Usar o tipo User do serviço
type FranchiseUser = User;

interface FranchiseUsersManagerProps {
  franchise: Franchise;
  onUserAllocated?: () => void;
}

export const FranchiseUsersManager = ({
  franchise,
  onUserAllocated,
}: FranchiseUsersManagerProps) => {
  const [users, setUsers] = useState<FranchiseUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("franchisee");
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Carregar usuários ao montar o componente
  useEffect(() => {
    loadUsers();
  }, [franchise.unitId]);

  // Buscar usuários da franquia
  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const response = await UserService.listByUnitId(franchise.unitId);
      if (response.success && response.data) {
        setUsers(response.data);
      } else {
        setUsers([]);
      }
    } catch (error: any) {
      console.error("Erro ao carregar usuários:", error);
      toast.error(error.message || "Erro ao carregar usuários");
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Buscar usuários disponíveis (sem unitId ou com unitId diferente)
  const searchAvailableUsers = async (search: string) => {
    if (!search || search.length < 3) {
      setAvailableUsers([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const response = await UserService.searchAvailable(search);
      if (response.success && response.data) {
        setAvailableUsers(response.data);
      } else {
        setAvailableUsers([]);
      }
    } catch (error: any) {
      console.error("Erro ao buscar usuários:", error);
      toast.error(error.message || "Erro ao buscar usuários");
      setAvailableUsers([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Alocar usuário à franquia
  const allocateUser = async () => {
    if (!selectedUserId) {
      toast.error("Selecione um usuário");
      return;
    }

    setIsLoading(true);
    try {
      const response = await UserService.updateUnitId(selectedUserId, {
        unitId: franchise.unitId,
      });

      if (response.success) {
        toast.success("Usuário alocado com sucesso!");
        setIsDialogOpen(false);
        setSelectedUserId("");
        setSelectedRole("franchisee");
        setAvailableUsers([]);
        await loadUsers();
        onUserAllocated?.();
      } else {
        throw new Error(response.error || "Erro ao alocar usuário");
      }
    } catch (error: any) {
      console.error("Erro ao alocar usuário:", error);
      toast.error(error.message || "Erro ao alocar usuário");
    } finally {
      setIsLoading(false);
    }
  };

  // Remover usuário da franquia
  const removeUser = async (userId: string) => {
    if (!confirm("Tem certeza que deseja remover este usuário da franquia?")) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await UserService.updateUnitId(userId, {
        unitId: null,
      });

      if (response.success) {
        toast.success("Usuário removido da franquia");
        await loadUsers();
        onUserAllocated?.();
      } else {
        throw new Error(response.error || "Erro ao remover usuário");
      }
    } catch (error: any) {
      console.error("Erro ao remover usuário:", error);
      toast.error(error.message || "Erro ao remover usuário");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: FranchiseUser['status']) => {
    const config = {
      active: { label: "Ativo", className: "bg-neon-green/10 text-neon-green border-neon-green/20" },
      inactive: { label: "Inativo", className: "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20" },
      pending: { label: "Pendente", className: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20" },
      suspended: { label: "Suspenso", className: "bg-neon-red/10 text-neon-red border-neon-red/20" },
    };
    const statusConfig = config[status] || config.inactive;
    return (
      <Badge variant="secondary" className={statusConfig.className}>
        {statusConfig.label}
      </Badge>
    );
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Usuários da Franquia</h3>
            <p className="text-sm text-muted-foreground">
              Gerencie os usuários alocados para {franchise.name}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              UnitId: <span className="font-mono">{franchise.unitId}</span>
            </p>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90">
              <UserPlus className="h-4 w-4 mr-2" />
              Alocar Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Alocar Usuário à Franquia</DialogTitle>
              <DialogDescription>
                Selecione um usuário e defina seu papel na franquia {franchise.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="user-search">Buscar Usuário</Label>
                <div className="relative">
                  <Input
                    id="user-search"
                    placeholder="Digite o email ou nome do usuário..."
                    onChange={(e) => {
                      const value = e.target.value;
                      searchAvailableUsers(value);
                    }}
                  />
                  {isSearching && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
                {availableUsers.length > 0 && (
                  <div className="border rounded-lg max-h-48 overflow-y-auto">
                    {availableUsers.map((user) => (
                      <div
                        key={user.id}
                        className={`p-2 hover:bg-muted cursor-pointer ${
                          selectedUserId === user.id ? "bg-muted" : ""
                        }`}
                        onClick={() => setSelectedUserId(user.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                          {selectedUserId === user.id && (
                            <CheckCircle2 className="h-4 w-4 text-neon-green" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {availableUsers.length === 0 && !isSearching && (
                  <p className="text-xs text-muted-foreground">
                    Digite pelo menos 3 caracteres para buscar usuários
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Papel na Franquia</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o papel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="franchisee">Franqueado</SelectItem>
                    <SelectItem value="gerente">Gerente</SelectItem>
                    <SelectItem value="vendedor">Vendedor</SelectItem>
                    <SelectItem value="parceiro">Parceiro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={allocateUser}
                disabled={isLoading || !selectedUserId}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Alocar Usuário
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar usuários..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabela de Usuários */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Nenhum usuário encontrado</p>
          <p className="text-sm mt-1">
            {users.length === 0
              ? "Aloque usuários para esta franquia"
              : "Nenhum usuário corresponde à busca"}
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Papel</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Alocado em</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell>
                  <Badge variant="outline">{user.role}</Badge>
                </TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeUser(user.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
};

