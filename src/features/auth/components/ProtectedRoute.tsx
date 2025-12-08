import React, { ReactNode } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { UserRole } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Lock, AlertTriangle } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  allowedRoles?: UserRole[];
  fallback?: ReactNode;
  showLogin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  allowedRoles,
  fallback,
  showLogin = true
}) => {
  const { user, isAuthenticated, isLoading } = useAuthContext();

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Se não requer autenticação, renderizar children
  if (!requireAuth) {
    return <>{children}</>;
  }

  // Se requer autenticação mas usuário não está logado
  if (!isAuthenticated || !user) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="p-8 text-center space-y-4">
            <Lock className="h-12 w-12 text-gray-400 mx-auto" />
            <div>
              <h2 className="text-xl font-semibold mb-2">Acesso Restrito</h2>
              <p className="text-muted-foreground">
                Você precisa estar logado para acessar esta página.
              </p>
            </div>
            {showLogin && (
              <Button 
                onClick={() => window.location.href = '/login'}
                className="w-full"
              >
                Fazer Login
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Se há restrições de role e usuário não tem permissão
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="p-8 text-center space-y-4">
            <Shield className="h-12 w-12 text-red-400 mx-auto" />
            <div>
              <h2 className="text-xl font-semibold mb-2 text-red-600">
                Acesso Negado
              </h2>
              <p className="text-muted-foreground">
                Você não tem permissão para acessar esta página.
              </p>
              <p className="text-base text-gray-500 mt-2">
                Seu perfil: <span className="font-medium">{user.role}</span>
              </p>
              <p className="text-base text-gray-500">
                Perfis permitidos: <span className="font-medium">{allowedRoles.join(', ')}</span>
              </p>
            </div>
            <Button 
              variant="outline"
              onClick={() => window.history.back()}
              className="w-full"
            >
              Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Se passou por todas as verificações, renderizar children
  return <>{children}</>;
};

// Component para verificação de permissões específicas
interface PermissionGuardProps {
  children: ReactNode;
  permission?: string;
  resource?: string;
  action?: string;
  fallback?: ReactNode;
  showWarning?: boolean;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  permission,
  resource,
  action,
  fallback,
  showWarning = false
}) => {
  const { hasPermission, canAccess } = useAuthContext();

  let hasAccess = true;

  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (resource && action) {
    hasAccess = canAccess(resource, action);
  }

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (showWarning) {
      return (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <p className="text-base text-yellow-800">
              Você não tem permissão para ver este conteúdo.
            </p>
          </div>
        </div>
      );
    }

    return null;
  }

  return <>{children}</>;
};

// Hook para redirecionamento baseado em role
export const useRoleRedirect = () => {
  const { user, isAuthenticated } = useAuthContext();

  const getDefaultRoute = (): string => {
    if (!isAuthenticated || !user) {
      return '#/login';
    }

    console.log('getDefaultRoute', user.role);

    switch (user.role) {
      case 'manager':
      case 'gerente':
      case 'sistema':
      case 'admin':
        return '#/admin?tab=dashboard';
      case 'partner':
      case 'parceiro':
      case 'franchisee':
        return '#/dashboard';    
      case 'suporte':  
      case 'support':
        return '#/admin?tab=users';
      case 'vendedor':
      case 'sales':
        return '#/admin?tab=leads';

      case 'cliente':
      case 'lead':
        return '#/last-visited';
      default:
        return '#/';
    }
  };

  const redirectToDefault = () => {
    const route = getDefaultRoute();
    console.log('redirectToDefault', route);
    window.location.href = route;
  };

  return { getDefaultRoute, redirectToDefault };
};
