// Exportações principais da feature de autenticação

export { LoginForm } from './components/LoginForm';
export { RegisterForm } from './components/RegisterForm';
export { ProtectedRoute, PermissionGuard, useRoleRedirect } from './components/ProtectedRoute';

export { AuthProvider, useAuthContext, useCurrentUser, usePermissions } from './context/AuthContext';

export { useAuth } from './hooks/useAuth';

export type { 
  User, 
  AuthState, 
  LoginCredentials, 
  RegisterData, 
  UserRole, 
  AuthContextType,
  Permission,
  Role
} from './types';

export { AuthPage } from '@/pages/AuthPage';
