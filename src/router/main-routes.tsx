// Import das páginas
import { LandingPage } from '@/pages/LandingPage';
import { AuthPage } from '@/pages/AuthPage';
import { AdminDashboard } from '@/pages/AdminDashboard';
import { FranchiseeDashboard } from '@/pages/FranchiseeDashboard';
import EcommercePage from '@/pages/Ecommerce/EcommercePage';
import { Route } from '.';

// Definição das rotas
const routes: Route[] = [
  {
    path: '/',
    component: EcommercePage,
    exact: true
  },
  // Página de Franquias
  {
    path: '/franchisees',
    component: LandingPage,
    exact: true
  },
  // Página de Login
  {
    path: '/auth',
    component: AuthPage,
    exact: true
  },
  {
    path: '/login',
    component: () => <AuthPage defaultTab="login" />,
    exact: true
  },
  {
    path: '/register',
    component: () => <AuthPage defaultTab="register" />,
    exact: true
  },
  {
    path: '/admin',
    component: AdminDashboard,
    requireAuth: true,
    allowedRoles: ['admin', 'support']
  },
  {
    path: '/dashboard',
    component: FranchiseeDashboard,
    requireAuth: true,
    allowedRoles: ['franchisee']
  }
];

export { routes };