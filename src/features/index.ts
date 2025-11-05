// Exportações principais das features implementadas

// Chatbot Feature
export { 
  Chatbot, 
  useChatbot,
  franchiseLeadFlow,
  supportFlow,
  productInfoFlow 
} from '@/features/chatbot';

// Suppliers Feature  
export {
  SupplierCard,
  SupplierCatalog,
  SupplierFilter,
  useSuppliers
} from '@/features/suppliers';

// Franchise Feature
export {
  useGameification
} from '@/features/franchise';

// Admin Feature
export {
  DashboardOverviewCard,
  LeadsManagement,
  useAdminDashboard
} from '@/features/admin';

// Pages
export { AdminDashboard } from '@/pages/Admin/AdminDashboard';
export { FranchiseeDashboard } from '@/pages/FranchiseeDashboard';

// Types (principais)
export type { 
  ChatMessage, 
  LeadData, 
  Supplier, 
  FranchiseeTask,
  AdminDashboard as AdminDashboardType,
  Lead
} from '@/features/*/types';
