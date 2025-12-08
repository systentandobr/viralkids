import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Lock, AlertCircle, Home, ArrowLeft } from 'lucide-react';
import { useAuthContext } from '@/features/auth';
import { getRoleDisplayName, getRoleDescription } from '@/features/auth/utils/roleUtils';
import { useRouter } from '@/router';

interface AccessDeniedProps {
  /**
   * Título personalizado da mensagem
   */
  title?: string;
  
  /**
   * Descrição personalizada da mensagem
   */
  description?: string;
  
  /**
   * Mensagem adicional de ajuda
   */
  helpText?: string;
  
  /**
   * Roles permitidos para esta funcionalidade (para mostrar ao usuário)
   */
  allowedRoles?: string[];
  
  /**
   * Se deve mostrar informações sobre o role do usuário
   */
  showUserRole?: boolean;
  
  /**
   * Se deve mostrar botão para voltar
   */
  showBackButton?: boolean;
  
  /**
   * Se deve mostrar botão para ir ao início
   */
  showHomeButton?: boolean;
  
  /**
   * URL para redirecionar ao clicar em "Ir ao Início"
   */
  homeUrl?: string;
  
  /**
   * Variante do componente (fullscreen ou inline)
   */
  variant?: 'fullscreen' | 'inline';
  
  /**
   * Ícone personalizado
   */
  icon?: 'shield' | 'lock' | 'alert';
}

export function AccessDenied({
  title,
  description,
  helpText,
  allowedRoles,
  showUserRole = true,
  showBackButton = true,
  showHomeButton = true,
  homeUrl,
  variant = 'fullscreen',
  icon = 'shield',
}: AccessDeniedProps) {
  const { user } = useAuthContext();
  const { navigate } = useRouter();

  const getIcon = () => {
    switch (icon) {
      case 'lock':
        return <Lock className="h-16 w-16 text-gray-400 mx-auto" />;
      case 'alert':
        return <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto" />;
      default:
        return <Shield className="h-16 w-16 text-red-400 mx-auto" />;
    }
  };

  const defaultTitle = title || 'Acesso Negado';
  const defaultDescription =
    description ||
    'Você não tem permissão para acessar esta funcionalidade. Entre em contato com o administrador do sistema se acredita que isso é um erro.';

  const userRoleDisplay = user ? getRoleDisplayName(user.role) : 'Não identificado';
  const userRoleDescription = user ? getRoleDescription(user.role) : '';

  const handleGoHome = () => {
    if (homeUrl) {
      navigate(homeUrl);
    } else {
      navigate('#/');
    }
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const content = (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-4">{getIcon()}</div>
        <CardTitle className="text-2xl font-bold text-red-600">{defaultTitle}</CardTitle>
        <CardDescription className="text-base mt-2">{defaultDescription}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Informações do usuário */}
        {showUserRole && user && (
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Seu perfil:</span>
              <span className="text-base font-semibold">{userRoleDisplay}</span>
            </div>
            {userRoleDescription && (
              <p className="text-sm text-muted-foreground mt-1">{userRoleDescription}</p>
            )}
            {user.email && (
              <p className="text-xs text-muted-foreground mt-1">Email: {user.email}</p>
            )}
          </div>
        )}

        {/* Roles permitidos */}
        {allowedRoles && allowedRoles.length > 0 && (
          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
              Perfis com acesso a esta funcionalidade:
            </p>
            <div className="flex flex-wrap gap-2">
              {allowedRoles.map((role) => (
                <span
                  key={role}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                >
                  {getRoleDisplayName(role as any)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Mensagem de ajuda */}
        {helpText && (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">{helpText}</p>
            </div>
          </div>
        )}

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          {showBackButton && (
            <Button variant="outline" onClick={handleGoBack} className="flex-1">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          )}
          {showHomeButton && (
            <Button onClick={handleGoHome} className="flex-1">
              <Home className="h-4 w-4 mr-2" />
              Ir ao Início
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (variant === 'fullscreen') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        {content}
      </div>
    );
  }

  return <div className="p-4">{content}</div>;
}

