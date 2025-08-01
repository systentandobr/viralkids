// Tipos para o sistema de franquias

export interface FranchisePackage {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  products: number;
  trainingHours: number;
  supportMonths: number;
  exclusiveTerritory: boolean;
  marketingSupport: boolean;
  color: string;
  popular?: boolean;
}

export interface Franchisee {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  packageType: 'starter' | 'premium' | 'master';
  status: 'pending' | 'active' | 'suspended' | 'cancelled';
  startDate?: Date;
  territory: Territory;
  profile: FranchiseeProfile;
  performance: FranchiseePerformance;
  tasks: FranchiseeTask[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Territory {
  id: string;
  name: string;
  city: string;
  state: string;
  exclusive: boolean;
  population: number;
  marketPotential: 'low' | 'medium' | 'high';
}

export interface FranchiseeProfile {
  experience: 'none' | 'some' | 'experienced';
  budget: string;
  timeToStart: string;
  motivation: string;
  previousBusiness?: string;
  availableTime: string;
  marketingExperience: boolean;
  socialMediaPresence: SocialMediaPresence;
}

export interface SocialMediaPresence {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  whatsapp?: string;
}

export interface FranchiseePerformance {
  totalSales: number;
  monthlyTarget: number;
  achievedTarget: boolean;
  averageTicket: number;
  customerCount: number;
  tasksCompleted: number;
  totalTasks: number;
  score: number;
  level: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
  type: 'bronze' | 'silver' | 'gold' | 'diamond';
}

export interface FranchiseeTask {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  type: TaskType;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  dueDate?: Date;
  completedAt?: Date;
  instructions: string;
  resources: TaskResource[];
  dependencies?: string[];
  validation?: TaskValidation;
}

export type TaskCategory = 
  | 'setup' 
  | 'marketing' 
  | 'sales' 
  | 'social_media' 
  | 'training' 
  | 'compliance' 
  | 'performance';

export type TaskType = 
  | 'profile_setup'
  | 'instagram_creation'
  | 'product_catalog'
  | 'first_post'
  | 'follow_suppliers'
  | 'market_research'
  | 'customer_acquisition'
  | 'sales_training'
  | 'compliance_docs';

export interface TaskResource {
  id: string;
  type: 'video' | 'document' | 'template' | 'link' | 'image';
  title: string;
  url: string;
  description: string;
}

export interface TaskValidation {
  type: 'upload' | 'link' | 'text' | 'multiple_choice';
  required: boolean;
  instructions: string;
  acceptedFormats?: string[];
  maxSize?: number;
}

export interface FranchiseOnboarding {
  id: string;
  franchiseeId: string;
  currentStep: number;
  totalSteps: number;
  steps: OnboardingStep[];
  startedAt: Date;
  completedAt?: Date;
  progress: number;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'task' | 'form' | 'validation';
  status: 'pending' | 'active' | 'completed';
  content: any;
  completedAt?: Date;
}

export interface FranchiseCheckout {
  id: string;
  leadId: string;
  packageId: string;
  customerInfo: CustomerInfo;
  paymentInfo: PaymentInfo;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  totalAmount: number;
  discountAmount?: number;
  finalAmount: number;
  createdAt: Date;
  completedAt?: Date;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  document: string;
  address: Address;
  businessInfo?: BusinessInfo;
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface BusinessInfo {
  companyName?: string;
  cnpj?: string;
  stateRegistration?: string;
}

export interface PaymentInfo {
  method: 'credit_card' | 'debit_card' | 'pix' | 'bank_slip';
  installments: number;
  cardInfo?: CardInfo;
  pixInfo?: PixInfo;
}

export interface CardInfo {
  holderName: string;
  number: string;
  expirationMonth: number;
  expirationYear: number;
  cvv: string;
}

export interface PixInfo {
  qrCode: string;
  copyPasteCode: string;
  expirationDate: Date;
}

export interface FranchiseSupport {
  id: string;
  franchiseeId: string;
  type: 'technical' | 'marketing' | 'sales' | 'training' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  subject: string;
  description: string;
  assignedTo?: string;
  createdAt: Date;
  resolvedAt?: Date;
  messages: SupportMessage[];
}

export interface SupportMessage {
  id: string;
  senderId: string;
  senderType: 'franchisee' | 'support';
  message: string;
  attachments?: string[];
  createdAt: Date;
}
