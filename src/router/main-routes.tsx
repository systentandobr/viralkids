// Import das páginas
import { LandingPage } from '@/pages/Franchise/LandingPage';
import { AuthPage } from '@/pages/AuthPage';
import { AdminDashboard } from '@/pages/Admin/AdminDashboard';
import { FranchiseeDashboard } from '@/pages/Admin/FranchiseeDashboard';
import EcommercePage from '@/pages/Ecommerce/EcommercePage';
import CheckoutPage from '@/pages/Ecommerce/CheckoutPage';
import ProductDetailPage from '@/pages/ProductDetail/ProductDetailPage';
import RouteTest from '@/components/RouteTest';
import { Route } from '.';

// Definição das rotas
const routes: Route[] = [
  {
    path: '/',
    component: EcommercePage,
    exact: true
  },
  // Rota de teste para debug
  {
    path: '/test-routes',
    component: RouteTest,
    exact: true
  },
  // Página de detalhes do produto (deve vir antes de /products)
  {
    path: '/product/detail/:id',
    component: ProductDetailPage,
    exact: false
  },
  // Página de produtos (deve vir depois das rotas mais específicas)
  {
    path: '/products-details',
    component: ProductDetailPage,
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
    allowedRoles: ['admin', 'support', 'sistema', 'system']
  },
  {
    path: '/dashboard',
    component: FranchiseeDashboard,
    requireAuth: true,
    allowedRoles: ['franchisee', 'gerente', 'franquia', 'franqueado', 'parceiro', 'vendedor']
  },
  {
    path: '/checkout',
    component: CheckoutPage,
    requireAuth: true,
    allowedRoles: ['franchisee', 'gerente', 'franquia', 'franqueado', 'parceiro', 'vendedor', 'admin', 'sistema', 'system', 'support']
  }
];

export { routes };