// Tipos para o painel administrativo

export interface AdminDashboard {
  overview: DashboardOverview;
  leads: LeadMetrics;
  franchises: FranchiseMetrics;
  sales: SalesMetrics;
  suppliers: SupplierMetrics;
  performance: PerformanceMetrics;
  recentActivity: ActivityItem[];
}

export interface DashboardOverview {
  totalLeads: number;
  newLeadsToday: number;
  activeFranchises: number;
  totalRevenue: number;
  monthlyGrowth: number;
  conversionRate: number;
  averageTicket: number;
  customerSatisfaction: number;
}

export interface LeadMetrics {
  total: number;
  newToday: number;
  qualified: number;
  converted: number;
  conversionRate: number;
  averageResponseTime: number; // em minutos
  leadsBySource: LeadSource[];
  leadsByStatus: LeadStatus[];
  leadsByPackage: LeadPackage[];
  recentLeads: Lead[];
}

export interface LeadSource {
  source: string;
  count: number;
  percentage: number;
  conversionRate: number;
}

export interface LeadStatus {
  status: 'new' | 'contacted' | 'qualified' | 'converted';
  count: number;
  percentage: number;
}

export interface LeadPackage {
  package: 'starter' | 'premium' | 'master';
  count: number;
  percentage: number;
  averageValue: number;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  franchiseType: 'starter' | 'premium' | 'master';
  experience: 'none' | 'some' | 'experienced';
  budget: string;
  timeToStart: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted';
  score: number;
  tags: string[];
  notes: LeadNote[];
  createdAt: Date;
  updatedAt: Date;
  contactedAt?: Date;
  convertedAt?: Date;
  assignedTo?: string;
}

export interface LeadNote {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  type: 'call' | 'email' | 'meeting' | 'note';
  createdAt: Date;
}

export interface FranchiseMetrics {
  total: number;
  active: number;
  pending: number;
  suspended: number;
  newThisMonth: number;
  byPackage: PackageBreakdown[];
  byRegion: RegionBreakdown[];
  averagePerformance: number;
  topPerformers: FranchisePerformer[];
}

export interface PackageBreakdown {
  package: 'starter' | 'premium' | 'master';
  count: number;
  percentage: number;
  averageRevenue: number;
}

export interface RegionBreakdown {
  state: string;
  count: number;
  percentage: number;
  averagePerformance: number;
}

export interface FranchisePerformer {
  id: string;
  name: string;
  city: string;
  package: string;
  score: number;
  revenue: number;
  tasksCompleted: number;
}

export interface SalesMetrics {
  totalRevenue: number;
  monthlyRevenue: number;
  franchiseFees: number;
  royalties: number;
  productsRevenue: number;
  trainingRevenue: number;
  growth: GrowthMetrics;
  forecast: RevenueForecast[];
}

export interface GrowthMetrics {
  monthlyGrowth: number;
  quarterlyGrowth: number;
  yearlyGrowth: number;
  targetAchievement: number;
}

export interface RevenueForecast {
  month: string;
  predicted: number;
  actual?: number;
  target: number;
}

export interface SupplierMetrics {
  total: number;
  verified: number;
  byState: StateBreakdown[];
  averageRating: number;
  newPartnerships: number;
  activeContracts: number;
}

export interface StateBreakdown {
  state: string;
  count: number;
  percentage: number;
}

export interface PerformanceMetrics {
  websiteTraffic: TrafficMetrics;
  chatbotMetrics: ChatbotMetrics;
  emailMetrics: EmailMetrics;
  socialMedia: SocialMediaMetrics;
}

export interface TrafficMetrics {
  totalVisits: number;
  uniqueVisitors: number;
  pageViews: number;
  bounceRate: number;
  averageSessionDuration: number;
  topPages: PageMetric[];
  conversionRate: number;
}

export interface PageMetric {
  page: string;
  views: number;
  uniqueViews: number;
  conversionRate: number;
}

export interface ChatbotMetrics {
  totalConversations: number;
  completedFlows: number;
  averageFlowCompletion: number;
  leadGeneration: number;
  mostCommonQuestions: QuestionMetric[];
  userSatisfaction: number;
}

export interface QuestionMetric {
  question: string;
  count: number;
  percentage: number;
}

export interface EmailMetrics {
  sentEmails: number;
  openRate: number;
  clickRate: number;
  unsubscribeRate: number;
  bounceRate: number;
  topCampaigns: CampaignMetric[];
}

export interface CampaignMetric {
  campaign: string;
  openRate: number;
  clickRate: number;
  conversions: number;
}

export interface SocialMediaMetrics {
  instagram: SocialMetric;
  facebook: SocialMetric;
  tiktok: SocialMetric;
  whatsapp: SocialMetric;
}

export interface SocialMetric {
  followers: number;
  growth: number;
  engagement: number;
  reach: number;
  leads: number;
}

export interface ActivityItem {
  id: string;
  type: 'lead' | 'franchise' | 'sale' | 'support' | 'system';
  title: string;
  description: string;
  actor: string;
  timestamp: Date;
  icon: string;
  severity: 'info' | 'success' | 'warning' | 'error';
  metadata?: Record<string, any>;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'analyst' | 'support';
  permissions: Permission[];
  avatar?: string;
  lastLogin: Date;
  createdAt: Date;
}

export type Permission = 
  | 'view_dashboard'
  | 'manage_leads'
  | 'manage_franchises'
  | 'manage_suppliers'
  | 'view_analytics'
  | 'manage_users'
  | 'system_settings';

export interface AdminAction {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  metadata: Record<string, any>;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
}

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  version: string;
  lastUpdate: Date;
  metrics: HealthMetric[];
  alerts: SystemAlert[];
}

export interface HealthMetric {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  threshold: {
    warning: number;
    critical: number;
  };
}

export interface SystemAlert {
  id: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  timestamp: Date;
  resolved: boolean;
  resolvedAt?: Date;
}

export interface AdminFilters {
  dateRange: {
    start: Date;
    end: Date;
  };
  region?: string[];
  package?: string[];
  status?: string[];
  source?: string[];
}
