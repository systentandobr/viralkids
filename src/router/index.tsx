import React, { useState, useEffect, ReactNode } from 'react';
import { useAuthContext } from '@/features/auth';

// Tipos para o sistema de rotas
export interface Route {
  path: string;
  component: React.ComponentType<any>;
  requireAuth?: boolean;
  allowedRoles?: string[];
  exact?: boolean;
}

interface RouterProps {
  routes: Route[];
  fallback?: ReactNode;
}

// Hook para navegação
export const useRouter = () => {
  const [currentPath, setCurrentPath] = useState(window.location.hash.slice(1) || '/');

  useEffect(() => {
    const handleHashChange = () => {
      const newPath = window.location.hash.slice(1) || '/';
      console.log('Hash changed to:', newPath);
      setCurrentPath(newPath);
    };

    // Trigger initial load
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string) => {
    console.log('Navigating to:', path);
    window.location.hash = path;
  };

  const replace = (path: string) => {
    console.log('Replacing with:', path);
    window.location.replace(`#${path}`);
  };

  const goBack = () => {
    window.history.back();
  };

  const goForward = () => {
    window.history.forward();
  };

  return {
    currentPath,
    navigate,
    replace,
    goBack,
    goForward
  };
};

// Componente Router principal
export const Router: React.FC<RouterProps> = ({ routes, fallback }) => {
  const { currentPath } = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthContext();

  console.log('Router render - currentPath:', currentPath, 'isLoading:', isLoading, 'isAuthenticated:', isAuthenticated);

  // Mostrar loading durante verificação de auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // Encontrar rota correspondente
  const matchedRoute = routes.find(route => {
    if (route.exact) {
      return route.path === currentPath;
    }
    return currentPath.startsWith(route.path);
  });

  console.log('Matched route:', matchedRoute?.path || 'none');

  if (!matchedRoute) {
    console.log('No route matched, showing fallback');
    return fallback ? <>{fallback}</> : <div>Página não encontrada</div>;
  }

  // Verificar autenticação
  if (matchedRoute.requireAuth && !isAuthenticated) {
    console.log('Auth required, redirecting to login');
    // Redirecionar para login
    window.location.hash = '/login';
    return null;
  }

  // Verificar permissões de role
  if (matchedRoute.allowedRoles && user && !matchedRoute.allowedRoles.includes(user.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <h2 className="text-xl font-semibold text-red-600">Acesso Negado</h2>
          <p className="text-gray-600">
            Você não tem permissão para acessar esta página.
          </p>
          <button
            onClick={() => window.location.hash = '/'}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  console.log('Rendering component for route:', matchedRoute.path);
  const Component = matchedRoute.component;
  return <Component />;
};

// Componente Link para navegação
interface LinkProps {
  to: string;
  children: ReactNode;
  className?: string;
  replace?: boolean;
}

export const Link: React.FC<LinkProps> = ({ to, children, className, replace = false }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (replace) {
      window.location.replace(`#${to}`);
    } else {
      window.location.hash = to;
    }
  };

  return (
    <a href={`#${to}`} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};

// Hook para parâmetros de rota (básico)
export const useParams = () => {
  const { currentPath } = useRouter();
  
  // Extrair parâmetros simples da URL
  const params: Record<string, string> = {};
  
  // Exemplo: /user/:id -> /user/123
  const pathSegments = currentPath.split('/');
  
  return params;
};

// Hook para query string
export const useQuery = () => {
  const [query, setQuery] = useState(new URLSearchParams(window.location.search));

  useEffect(() => {
    const handleLocationChange = () => {
      setQuery(new URLSearchParams(window.location.search));
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const get = (key: string): string | null => {
    return query.get(key);
  };

  const set = (key: string, value: string) => {
    const newQuery = new URLSearchParams(query);
    newQuery.set(key, value);
    
    const newUrl = `${window.location.pathname}?${newQuery.toString()}${window.location.hash}`;
    window.history.pushState({}, '', newUrl);
    setQuery(newQuery);
  };

  const remove = (key: string) => {
    const newQuery = new URLSearchParams(query);
    newQuery.delete(key);
    
    const newUrl = `${window.location.pathname}?${newQuery.toString()}${window.location.hash}`;
    window.history.pushState({}, '', newUrl);
    setQuery(newQuery);
  };

  return { get, set, remove, query };
};
