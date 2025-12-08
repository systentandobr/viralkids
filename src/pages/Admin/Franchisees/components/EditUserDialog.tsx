import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Loader2, Shield } from 'lucide-react';
import { UserService, User } from '@/services/users/userService';
import { RolesService, Role, Permission } from '@/services/users/rolesService';
import { toast } from 'sonner';
import { useAuthContext } from '@/features/auth';
import { isAdminRole, ROLE_CATEGORIES } from '@/features/auth/utils/roleUtils';

interface EditUserDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditUserDialog({ user, open, onOpenChange, onSuccess }: EditUserDialogProps) {
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [availablePermissions, setAvailablePermissions] = useState<Permission[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user: currentUser } = useAuthContext();

  const canManageRoles = currentUser && isAdminRole(currentUser.role);

  useEffect(() => {
    if (open && user && canManageRoles) {
      loadRolesAndPermissions();
      // Carregar roles e permissões atuais do usuário
      const userRoles = user.roles || [];
      const userRoleNames = userRoles.map((r: any) => {
        if (typeof r === 'object' && r !== null && 'name' in r) {
          return r.name;
        }
        return r;
      }).filter(Boolean);
      setSelectedRoles(userRoleNames);
      
      const userPermissions = user.permissions || [];
      const userPermissionNames = Array.isArray(userPermissions) 
        ? userPermissions.map((p: any) => {
            if (typeof p === 'object' && p !== null && 'name' in p) {
              return p.name;
            }
            return p;
          }).filter(Boolean)
        : [];
      setSelectedPermissions(userPermissionNames);
    }
  }, [open, user, canManageRoles]);

  const loadRolesAndPermissions = async () => {
    setIsLoadingRoles(true);
    try {
      const [rolesResponse, permissionsResponse] = await Promise.all([
        RolesService.getAvailableRoles(),
        RolesService.getAvailablePermissions(),
      ]);

      if (rolesResponse.success && rolesResponse.data) {
        setAvailableRoles(rolesResponse.data);
      }

      if (permissionsResponse.success && permissionsResponse.data) {
        setAvailablePermissions(permissionsResponse.data);
      }
    } catch (error) {
      console.error('Erro ao carregar roles e permissões:', error);
      toast.error('Não foi possível carregar roles e permissões');
    } finally {
      setIsLoadingRoles(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const response = await UserService.updateRoles(user.id, {
        roles: selectedRoles,
        permissions: selectedPermissions,
      });

      if (response.success) {
        toast.success('Usuário atualizado com sucesso!');
        onSuccess?.();
        onOpenChange(false);
      } else {
        throw new Error(response.error || 'Erro ao atualizar usuário');
      }
    } catch (error: any) {
      console.error('Erro ao atualizar usuário:', error);
      toast.error(error?.message || 'Erro ao atualizar usuário');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  if (!canManageRoles) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Acesso Negado</DialogTitle>
            <DialogDescription>
              Apenas administradores podem editar roles e permissões de usuários.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Editar Usuário: {user.name || user.username || user.email}
          </DialogTitle>
          <DialogDescription>
            Gerencie os roles e permissões do usuário
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Informações do usuário */}
          <div className="p-4 border rounded-lg bg-muted/50">
            <h4 className="font-semibold mb-2">Informações do Usuário</h4>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Nome:</span> {user.name || user.username || 'N/A'}</p>
              <p><span className="font-medium">Email:</span> {user.email || 'N/A'}</p>
              <p><span className="font-medium">Username:</span> {user.username || 'N/A'}</p>
            </div>
          </div>

          {isLoadingRoles ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2">Carregando roles e permissões...</span>
            </div>
          ) : (
            <>
              {/* Seleção de Roles */}
              <div className="space-y-4">
                <div>
                  <Label>Roles</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Selecione um ou mais roles para o usuário
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto border rounded-lg p-4">
                    {availableRoles
                      .filter(
                        (role) =>
                          !ROLE_CATEGORIES.ADMIN.includes(role.name) ||
                          currentUser?.role === 'admin' ||
                          currentUser?.role === 'system'
                      )
                      .map((role) => {
                        const isSelected = selectedRoles.includes(role.name);
                        return (
                          <div
                            key={role.id}
                            className={`flex items-start space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                              isSelected
                                ? 'border-primary bg-primary/5'
                                : 'border-muted hover:border-primary/50'
                            }`}
                            onClick={async () => {
                              if (isSelected) {
                                // Remover role
                                const newRoles = selectedRoles.filter((r) => r !== role.name);
                                setSelectedRoles(newRoles);
                                
                                // Remover permissões que não pertencem a outros roles selecionados
                                if (newRoles.length > 0) {
                                  // Buscar permissões dos roles restantes
                                  const remainingRolePromises = newRoles.map((roleName) => {
                                    const r = availableRoles.find((r) => r.name === roleName);
                                    if (r && r.permissions && r.permissions.length > 0) {
                                      return Promise.resolve(r.permissions.map((p) => p.name));
                                    }
                                    return RolesService.getRoleById(roleName).then((response) => {
                                      if (response.success && response.data?.permissions) {
                                        return response.data.permissions.map((p) => p.name);
                                      }
                                      return [];
                                    });
                                  });
                                  
                                  const remainingPermissionsArrays = await Promise.all(remainingRolePromises);
                                  const remainingPermissionsSet = new Set<string>();
                                  remainingPermissionsArrays.forEach((perms) => {
                                    perms.forEach((perm) => remainingPermissionsSet.add(perm));
                                  });
                                  
                                  // Manter apenas permissões que estão nos roles restantes ou foram selecionadas manualmente
                                  setSelectedPermissions((prev) => {
                                    return prev.filter((perm) => {
                                      // Manter se está nos roles restantes ou se foi selecionada manualmente
                                      // (assumimos que se não está em nenhum role, foi selecionada manualmente)
                                      return remainingPermissionsSet.has(perm);
                                    });
                                  });
                                } else {
                                  // Se não há mais roles selecionados, limpar permissões
                                  setSelectedPermissions([]);
                                }
                              } else {
                                // Adicionar role
                                setSelectedRoles([...selectedRoles, role.name]);
                                
                                // Buscar e adicionar permissões do role
                                const roleResponse = await RolesService.getRoleById(role.id);
                                if (roleResponse.success && roleResponse.data?.permissions) {
                                  const rolePermissions = roleResponse.data.permissions.map((p) => p.name);
                                  setSelectedPermissions((prev) => {
                                    const newSet = new Set(prev);
                                    rolePermissions.forEach((perm) => newSet.add(perm));
                                    return Array.from(newSet);
                                  });
                                }
                              }
                            }}
                          >
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={async (checked) => {
                                if (checked) {
                                  // Adicionar role
                                  setSelectedRoles([...selectedRoles, role.name]);
                                  
                                  // Buscar e adicionar permissões do role
                                  const roleResponse = await RolesService.getRoleById(role.id);
                                  if (roleResponse.success && roleResponse.data?.permissions) {
                                    const rolePermissions = roleResponse.data.permissions.map((p) => p.name);
                                    setSelectedPermissions((prev) => {
                                      const newSet = new Set(prev);
                                      rolePermissions.forEach((perm) => newSet.add(perm));
                                      return Array.from(newSet);
                                    });
                                  }
                                } else {
                                  // Remover role
                                  const newRoles = selectedRoles.filter((r) => r !== role.name);
                                  setSelectedRoles(newRoles);
                                  
                                  // Remover permissões que não pertencem a outros roles selecionados
                                  if (newRoles.length > 0) {
                                    const remainingRolePromises = newRoles.map((roleName) => {
                                      const r = availableRoles.find((r) => r.name === roleName);
                                      if (r && r.permissions && r.permissions.length > 0) {
                                        return Promise.resolve(r.permissions.map((p) => p.name));
                                      }
                                      return RolesService.getRoleById(roleName).then((response) => {
                                        if (response.success && response.data?.permissions) {
                                          return response.data.permissions.map((p) => p.name);
                                        }
                                        return [];
                                      });
                                    });
                                    
                                    const remainingPermissionsArrays = await Promise.all(remainingRolePromises);
                                    const remainingPermissionsSet = new Set<string>();
                                    remainingPermissionsArrays.forEach((perms) => {
                                      perms.forEach((perm) => remainingPermissionsSet.add(perm));
                                    });
                                    
                                    setSelectedPermissions((prev) => {
                                      return prev.filter((perm) => remainingPermissionsSet.has(perm));
                                    });
                                  } else {
                                    setSelectedPermissions([]);
                                  }
                                }
                              }}
                            />
                            <div className="flex-1">
                              <div className="font-medium">{role.displayName}</div>
                              <div className="text-sm text-muted-foreground">
                                {role.description}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                  {selectedRoles.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {selectedRoles.map((roleName) => {
                        const role = availableRoles.find((r) => r.name === roleName);
                        return (
                          <Badge key={roleName} variant="secondary">
                            {role?.displayName || roleName}
                          </Badge>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Seleção de Permissões */}
              <div className="space-y-4">
                <div>
                  <Label>Permissões</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Selecione permissões específicas (opcional)
                  </p>
                  <div className="space-y-2 max-h-64 overflow-y-auto border rounded-lg p-4">
                    {Object.entries(
                      availablePermissions.reduce(
                        (acc, perm) => {
                          if (!acc[perm.resource]) {
                            acc[perm.resource] = [];
                          }
                          acc[perm.resource].push(perm);
                          return acc;
                        },
                        {} as Record<string, Permission[]>
                      )
                    ).map(([resource, perms]) => (
                      <div key={resource} className="space-y-2">
                        <div className="font-medium text-sm capitalize">{resource}</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-4">
                          {perms.map((perm) => {
                            const isSelected = selectedPermissions.includes(perm.name);
                            return (
                              <div key={perm.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`perm-${perm.id}`}
                                  checked={isSelected}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedPermissions([...selectedPermissions, perm.name]);
                                    } else {
                                      setSelectedPermissions(
                                        selectedPermissions.filter((p) => p !== perm.name)
                                      );
                                    }
                                  }}
                                />
                                <Label
                                  htmlFor={`perm-${perm.id}`}
                                  className="text-sm cursor-pointer"
                                >
                                  {perm.description}
                                </Label>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving || isLoadingRoles}>
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar Alterações'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

