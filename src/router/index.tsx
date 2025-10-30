import React, { useState, useEffect, ReactNode } from 'react';
import { useAuthContext } from '@/features/auth';
import { canAccessRoute } from '@/features/auth/utils/roleUtils';

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
    console.log(`Testando rota: ${route.path} contra: ${currentPath}`);
    
    if (route.exact) {
      const exactMatch = route.path === currentPath;
      console.log(`  Exact match: ${exactMatch}`);
      return exactMatch;
    }
    
    // Para rotas dinâmicas (com parâmetros como :id)
    if (route.path.includes(':')) {
      const routePattern = route.path.replace(/:[^/]+/g, '[^/]+');
      const regex = new RegExp(`^${routePattern}$`);
      const dynamicMatch = regex.test(currentPath);
      console.log(`  Dynamic match (${routePattern}): ${dynamicMatch}`);
      return dynamicMatch;
    }
    
    // Para rotas normais
    const startsWithMatch = currentPath.startsWith(route.path);
    console.log(`  StartsWith match: ${startsWithMatch}`);
    return startsWithMatch;
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
  if (matchedRoute.allowedRoles && user && !canAccessRoute(user.role, matchedRoute.allowedRoles)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <h2 className="text-xl font-semibold text-red-600">Acesso Negado</h2>
          <p className="text-gray-600">
            Você não tem permissão para acessar esta página.
          </p>
          <p className="text-sm text-gray-500">
            Role atual: <span className="font-medium">{user.role}</span>
          </p>
          <p className="text-sm text-gray-500">
            Roles permitidos: {matchedRoute.allowedRoles.join(', ')}
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
  
  // Exemplo: /product/detail/:id -> /product/detail/123
  const pathSegments = currentPath.split('/');
  
  // Extrair ID do produto se estiver na rota /product/detail/:id
  if (pathSegments[1] === 'product' && pathSegments[2] === 'detail' && pathSegments[3]) {
    params.id = pathSegments[3];
  }
  
  // Extrair ID do produto se estiver na rota /produto/:id
  if (pathSegments[1] === 'produto' && pathSegments[2]) {
    params.id = pathSegments[2];
  }
  
  // Extrair parâmetros dinâmicos de qualquer rota
  // Exemplo: /user/:id/profile/:tab -> /user/123/profile/settings
  const routes = [
    { pattern: '/product/detail/:id', params: ['id'] },
    { pattern: '/produto/:id', params: ['id'] },
    { pattern: '/user/:id/profile/:tab', params: ['id', 'tab'] },
    // Adicione mais padrões conforme necessário
  ];
  
  for (const route of routes) {
    const patternSegments = route.pattern.split('/');
    if (patternSegments.length === pathSegments.length) {
      let matches = true;
      const extractedParams: Record<string, string> = {};
      
      for (let i = 0; i < patternSegments.length; i++) {
        const patternSegment = patternSegments[i];
        const pathSegment = pathSegments[i];
        
        if (patternSegment.startsWith(':')) {
          // É um parâmetro dinâmico
          const paramName = patternSegment.slice(1);
          extractedParams[paramName] = pathSegment;
        } else if (patternSegment !== pathSegment) {
          // Segmentos não coincidem
          matches = false;
          break;
        }
      }
      
      if (matches) {
        Object.assign(params, extractedParams);
        break;
      }
    }
  }
  
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
