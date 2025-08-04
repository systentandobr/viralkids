import React from 'react';
import { useNavigation } from '../stores/additional/navigation.store';
import { Link } from '../router';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumbs: React.FC = () => {
  const { breadcrumbs } = useNavigation();

  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
      <Link 
        to="/" 
        className="flex items-center hover:text-blue-600 transition-colors"
      >
        <Home className="w-4 h-4 mr-1" />
        Home
      </Link>
      
      {breadcrumbs.map((breadcrumb, index) => (
        <React.Fragment key={breadcrumb.path}>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          
          {index === breadcrumbs.length - 1 ? (
            // Último item (ativo)
            <span className="text-gray-900 font-medium">
              {breadcrumb.label}
            </span>
          ) : (
            // Links navegáveis
            <Link 
              to={breadcrumb.path}
              className="hover:text-blue-600 transition-colors"
            >
              {breadcrumb.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}; 