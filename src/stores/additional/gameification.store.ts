import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import React from 'react';
import { ChartLine, LucideIcon, UserRound, Users } from 'lucide-react';

// Tipos
export interface FranchiseeTask {
  id: string;
  title: string;
  description: string;
  category: 'setup' | 'social_media' | 'marketing' | 'sales' | 'training';
  type: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  status: 'pending' | 'completed' | 'failed';
  dependencies?: string[];
  instructions: string;
  color: string;
  icon: LucideIcon;
  resources?: Array<{
    id: string;
    type: 'video' | 'document' | 'template' | 'link';
    title: string;
    url: string;
    description: string;
  }>;
  validation?: {
    type: 'link' | 'upload' | 'text';
    required: boolean;
    instructions: string;
    acceptedFormats?: string[];
  };
  dueDate?: Date;
  completedAt?: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
  type: 'bronze' | 'silver' | 'gold' | 'platinum';
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
  badges: string[];
}

interface FranchiseeGameificationData {
  tasks: FranchiseeTask[];
  completedTasks: FranchiseeTask[];
  badges: Badge[];
  performance: FranchiseePerformance;
  level: number;
  totalPoints: number;
  progress: number;
}

interface GameificationStore {
  // Estado
  gameificationData: Record<string, FranchiseeGameificationData>;
  isLoading: boolean;
  error: string | null;

  // Ações principais
  initializeFranchisee: (franchiseeId: string) => void;
  completeTask: (franchiseeId: string, taskId: string, validation?: any) => Promise<void>;
  resetProgress: (franchiseeId: string) => void;
  updatePerformance: (franchiseeId: string, performance: Partial<FranchiseePerformance>) => void;
  
  // Utilitários
  getFranchiseeData: (franchiseeId: string) => FranchiseeGameificationData | null;
  getAvailableTasks: (franchiseeId: string) => FranchiseeTask[];
  getTasksByCategory: (franchiseeId: string, category: FranchiseeTask['category']) => FranchiseeTask[];
  getNextLevelPoints: (franchiseeId: string) => number;
  calculateLevel: (points: number) => number;
  calculateProgress: (franchiseeId: string) => void;
  
  // Estado
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

const LEVEL_POINTS = [0, 100, 250, 500, 1000, 2000, 4000, 8000, 15000, 30000];

const DEFAULT_TASKS: FranchiseeTask[] = [
  {
    id: 'setup-profile',
    title: 'Complete seu Perfil',
    description: 'Adicione suas informações pessoais e de negócio para começar sua jornada.',
    category: 'setup',
    type: 'profile_setup',
    difficulty: 'easy',
    points: 50,
    status: 'pending',
    instructions: 'Vá para a seção "Meu Perfil" e preencha todas as informações obrigatórias.',
    resources: [
      {
        id: 'profile-guide',
        type: 'video',
        title: 'Como completar seu perfil',
        url: '/guides/profile-setup.mp4',
        description: 'Vídeo explicativo sobre como preencher seu perfil'
      }
    ],
    color: "hsl(110 100% 54%)",
    icon: UserRound,
  },
  {
    id: 'create-instagram',
    title: 'Crie seu Instagram ViralKids',
    description: 'Configure seu perfil no Instagram seguindo nossos padrões de marca.',
    category: 'social_media',
    type: 'instagram_creation',
    difficulty: 'medium',
    points: 100,
    status: 'pending',
    dependencies: ['setup-profile'],
    instructions: 'Crie uma conta @viralkids.suacidade seguindo o template fornecido.',
    resources: [
      {
        id: 'instagram-template',
        type: 'template',
        title: 'Template Instagram ViralKids',
        url: '/templates/instagram-profile.pdf',
        description: 'Template completo para criar seu perfil'
      },
      {
        id: 'bio-examples',
        type: 'document',
        title: 'Exemplos de Bio',
        url: '/guides/instagram-bio-examples.pdf',
        description: 'Exemplos de biografias para inspiração'
      }
    ],
    validation: {
      type: 'link',
      required: true,
      instructions: 'Cole o link do seu perfil Instagram criado'
    },
    icon: UserRound,
    color: "hsl(217 100% 50%)",
  },
  {
    id: 'follow-suppliers',
    title: 'Siga nossos Fornecedores',
    description: 'Siga pelo menos 10 fornecedores parceiros para acompanhar novidades.',
    category: 'marketing',
    type: 'follow_suppliers',
    difficulty: 'easy',
    points: 75,
    status: 'pending',
    dependencies: ['create-instagram'],
    instructions: 'Acesse a lista de fornecedores e siga pelo menos 10 perfis no Instagram.',
    resources: [
      {
        id: 'suppliers-list',
        type: 'document',
        title: 'Lista de Fornecedores',
        url: '/suppliers/instagram-list.pdf',
        description: 'Lista completa dos fornecedores parceiros'
      }
    ],
    icon: Users,
    color: "hsl(110 100% 54%)"
  },
  {
    id: 'first-post',
    title: 'Faça seu Primeiro Post',
    description: 'Publique seu primeiro post de apresentação seguindo nosso template.',
    category: 'social_media',
    type: 'first_post',
    difficulty: 'medium',
    points: 150,
    status: 'pending',
    dependencies: ['create-instagram'],
    instructions: 'Use nosso template para criar um post de apresentação da sua franquia.',
    resources: [
      {
        id: 'post-template',
        type: 'template',
        title: 'Template Primeiro Post',
        url: '/templates/first-post.psd',
        description: 'Template editável para seu primeiro post'
      },
      {
        id: 'caption-guide',
        type: 'document',
        title: 'Guia de Legendas',
        url: '/guides/captions-guide.pdf',
        description: 'Como escrever legendas que vendem'
      }
    ],
    validation: {
      type: 'link',
      required: true,
      instructions: 'Cole o link do seu primeiro post'
    },
    icon: Users,
    color: "hsl(25 95% 53%)"
  },
  {
    id: 'market-research',
    title: 'Pesquise seu Mercado Local',
    description: 'Faça uma pesquisa dos concorrentes e oportunidades na sua região.',
    category: 'marketing',
    type: 'market_research',
    difficulty: 'hard',
    points: 200,
    status: 'pending',
    dependencies: ['setup-profile'],
    instructions: 'Pesquise lojas infantis, preços e oportunidades na sua cidade.',
    resources: [
      {
        id: 'research-template',
        type: 'template',
        title: 'Planilha de Pesquisa',
        url: '/templates/market-research.xlsx',
        description: 'Planilha para organizar sua pesquisa'
      }
    ],
    validation: {
      type: 'upload',
      required: true,
      instructions: 'Faça upload da planilha preenchida',
      acceptedFormats: ['.xlsx', '.pdf']
    },
    icon: ChartLine,
    color: "hsl(217 100% 50%)"
  }
];

const DEFAULT_PERFORMANCE: FranchiseePerformance = {
  totalSales: 0,
  monthlyTarget: 5000,
  achievedTarget: false,
  averageTicket: 0,
  customerCount: 0,
  tasksCompleted: 0,
  totalTasks: DEFAULT_TASKS.length,
  score: 0,
  level: 1,
  badges: []
};

export const useGameificationStore = create<GameificationStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      gameificationData: {},
      isLoading: false,
      error: null,

      // Inicializar franchisee
      initializeFranchisee: (franchiseeId: string) => {
        const { gameificationData } = get();
        
        if (!gameificationData[franchiseeId]) {
          set(state => ({
            gameificationData: {
              ...state.gameificationData,
              [franchiseeId]: {
                tasks: DEFAULT_TASKS.map(task => ({
                  ...task,
                  status: task.dependencies ? 'pending' : 'pending'
                })),
                completedTasks: [],
                badges: [],
                performance: DEFAULT_PERFORMANCE,
                level: 1,
                totalPoints: 0,
                progress: 0
              }
            }
          }));
        } else {
          // Restaurar ícones após carregar do localStorage (ícones não são serializáveis)
          const existingData = gameificationData[franchiseeId];
          if (existingData.tasks) {
            const restoredTasks = existingData.tasks.map((task: any) => {
              // Encontrar o ícone correspondente em DEFAULT_TASKS
              const defaultTask = DEFAULT_TASKS.find(t => t.id === task.id);
              return {
                ...task,
                icon: defaultTask?.icon || task.icon
              };
            });
            
            set(state => ({
              gameificationData: {
                ...state.gameificationData,
                [franchiseeId]: {
                  ...existingData,
                  tasks: restoredTasks
                }
              }
            }));
          }
        }
      },

      // Completar tarefa
      completeTask: async (franchiseeId: string, taskId: string, validation?: any) => {
        const { gameificationData } = get();
        const franchiseeData = gameificationData[franchiseeId];
        
        if (!franchiseeData) {
          throw new Error('Franchisee não encontrado');
        }

        set({ isLoading: true, error: null });

        try {
          const taskIndex = franchiseeData.tasks.findIndex(t => t.id === taskId);
          if (taskIndex === -1) {
            throw new Error('Tarefa não encontrada');
          }

          const task = { ...franchiseeData.tasks[taskIndex] };
          task.status = 'completed';
          task.completedAt = new Date();

          // Remover da lista de tarefas pendentes
          const newTasks = franchiseeData.tasks.filter(t => t.id !== taskId);
          
          // Adicionar à lista de tarefas completas
          const newCompletedTasks = [...franchiseeData.completedTasks, task];

          // Verificar se desbloqueou novas tarefas
          const unlockedTasks = newTasks.map(t => {
            if (t.dependencies?.includes(taskId)) {
              const allDependenciesCompleted = t.dependencies.every(depId =>
                newCompletedTasks.some(ct => ct.id === depId)
              );
              
              if (allDependenciesCompleted) {
                return { ...t, status: 'pending' as const };
              }
            }
            return t;
          });

          // Verificar badges conquistadas
          const newBadges = get().checkForNewBadges(newCompletedTasks, franchiseeData.badges);

          // Calcular novos valores
          const totalPoints = newCompletedTasks.reduce((sum, task) => sum + task.points, 0);
          const level = get().calculateLevel(totalPoints);
          const completedCount = newCompletedTasks.length;
          const totalCount = unlockedTasks.length + newCompletedTasks.length;
          const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

          // Atualizar estado
          set(state => ({
            gameificationData: {
              ...state.gameificationData,
              [franchiseeId]: {
                tasks: unlockedTasks,
                completedTasks: newCompletedTasks,
                badges: [...franchiseeData.badges, ...newBadges],
                performance: {
                  ...franchiseeData.performance,
                  tasksCompleted: completedCount,
                  totalTasks: totalCount,
                  score: totalPoints,
                  level
                },
                level,
                totalPoints,
                progress
              }
            },
            isLoading: false
          }));

          // Mostrar notificação de conquista
          if (newBadges.length > 0) {
            get().showBadgeNotification(newBadges);
          }

        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Erro ao completar tarefa',
            isLoading: false 
          });
          throw error;
        }
      },

      // Resetar progresso
      resetProgress: (franchiseeId: string) => {
        set(state => ({
          gameificationData: {
            ...state.gameificationData,
            [franchiseeId]: {
              tasks: DEFAULT_TASKS,
              completedTasks: [],
              badges: [],
              performance: DEFAULT_PERFORMANCE,
              level: 1,
              totalPoints: 0,
              progress: 0
            }
          }
        }));
      },

      // Verificar novas badges
      checkForNewBadges: (completedTasks: FranchiseeTask[], currentBadges: Badge[]): Badge[] => {
        const newBadges: Badge[] = [];
        
        // Badge primeira tarefa
        if (completedTasks.length >= 1 && !currentBadges.some(b => b.id === 'first-task')) {
          newBadges.push({
            id: 'first-task',
            name: 'Primeiro Passo',
            description: 'Completou sua primeira tarefa!',
            icon: '🎯',
            earnedAt: new Date(),
            type: 'bronze'
          });
        }
        
        // Badge 5 tarefas
        if (completedTasks.length >= 5 && !currentBadges.some(b => b.id === 'five-tasks')) {
          newBadges.push({
            id: 'five-tasks',
            name: 'Dedicado',
            description: 'Completou 5 tarefas!',
            icon: '🏅',
            earnedAt: new Date(),
            type: 'silver'
          });
        }
        
        // Badge Instagram criado
        if (completedTasks.some(t => t.id === 'create-instagram') && !currentBadges.some(b => b.id === 'instagram-master')) {
          newBadges.push({
            id: 'instagram-master',
            name: 'Instagram Master',
            description: 'Criou seu perfil no Instagram!',
            icon: '📱',
            earnedAt: new Date(),
            type: 'gold'
          });
        }

        return newBadges;
      },

      // Mostrar notificação de badge
      showBadgeNotification: (badges: Badge[]) => {
        // TODO: Implementar sistema de notificações
        console.log('Novas badges conquistadas:', badges);
      },

      // Atualizar performance
      updatePerformance: (franchiseeId: string, performance: Partial<FranchiseePerformance>) => {
        set(state => ({
          gameificationData: {
            ...state.gameificationData,
            [franchiseeId]: {
              ...state.gameificationData[franchiseeId],
              performance: {
                ...state.gameificationData[franchiseeId].performance,
                ...performance
              }
            }
          }
        }));
      },

      // Calcular nível
      calculateLevel: (points: number): number => {
        for (let i = LEVEL_POINTS.length - 1; i >= 0; i--) {
          if (points >= LEVEL_POINTS[i]) {
            return i + 1;
          }
        }
        return 1;
      },

      // Calcular progresso
      calculateProgress: (franchiseeId: string) => {
        const { gameificationData } = get();
        const franchiseeData = gameificationData[franchiseeId];
        
        if (!franchiseeData) return;

        const completedCount = franchiseeData.completedTasks.length;
        const totalCount = franchiseeData.tasks.length + franchiseeData.completedTasks.length;
        const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

        set(state => ({
          gameificationData: {
            ...state.gameificationData,
            [franchiseeId]: {
              ...franchiseeData,
              progress
            }
          }
        }));
      },

      // Obter dados do franchisee
      getFranchiseeData: (franchiseeId: string) => {
        const { gameificationData } = get();
        return gameificationData[franchiseeId] || null;
      },

      // Obter tarefas disponíveis
      getAvailableTasks: (franchiseeId: string): FranchiseeTask[] => {
        const franchiseeData = get().getFranchiseeData(franchiseeId);
        return franchiseeData?.tasks.filter(task => task.status === 'pending') || [];
      },

      // Obter tarefas por categoria
      getTasksByCategory: (franchiseeId: string, category: FranchiseeTask['category']): FranchiseeTask[] => {
        const franchiseeData = get().getFranchiseeData(franchiseeId);
        if (!franchiseeData) return [];
        
        return [...franchiseeData.tasks, ...franchiseeData.completedTasks]
          .filter(task => task.category === category);
      },

      // Obter pontos para próximo nível
      getNextLevelPoints: (franchiseeId: string): number => {
        const franchiseeData = get().getFranchiseeData(franchiseeId);
        if (!franchiseeData) return 0;

        const currentLevel = franchiseeData.level;
        if (currentLevel >= LEVEL_POINTS.length) {
          return LEVEL_POINTS[LEVEL_POINTS.length - 1];
        }
        
        return LEVEL_POINTS[currentLevel] - franchiseeData.totalPoints;
      },

      // Gerenciar estado
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: string | null) => set({ error }),
      clearError: () => set({ error: null })
    }),
    {
      name: 'viralkids-gameification-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        gameificationData: state.gameificationData 
      }),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        // Migração de versões futuras se necessário
        return persistedState;
      }
    }
  )
);

// Hook customizado para facilitar uso - versão corrigida para evitar loops
export const useGameification = (franchiseeId: string) => {
  // Usar seletores específicos para evitar re-renders desnecessários
  const franchiseeData = useGameificationStore(state => state.gameificationData[franchiseeId]);
  const isLoading = useGameificationStore(state => state.isLoading);
  const error = useGameificationStore(state => state.error);
  
  // Ações da store
  const initializeFranchisee = useGameificationStore(state => state.initializeFranchisee);
  const completeTask = useGameificationStore(state => state.completeTask);
  const resetProgress = useGameificationStore(state => state.resetProgress);
  const updatePerformance = useGameificationStore(state => state.updatePerformance);
  const getNextLevelPoints = useGameificationStore(state => state.getNextLevelPoints);
  const getAvailableTasks = useGameificationStore(state => state.getAvailableTasks);
  const getTasksByCategory = useGameificationStore(state => state.getTasksByCategory);
  const clearError = useGameificationStore(state => state.clearError);

  // Inicializar franchisee se não existir (apenas uma vez)
  React.useEffect(() => {
    if (franchiseeId && !franchiseeData) {
      initializeFranchisee(franchiseeId);
    }
  }, [franchiseeId, franchiseeData, initializeFranchisee]);

  return {
    // Estado
    tasks: franchiseeData?.tasks || [],
    completedTasks: franchiseeData?.completedTasks || [],
    badges: franchiseeData?.badges || [],
    performance: franchiseeData?.performance || DEFAULT_PERFORMANCE,
    level: franchiseeData?.level || 1,
    totalPoints: franchiseeData?.totalPoints || 0,
    progress: franchiseeData?.progress || 0,
    isLoading,
    error,

    // Ações
    completeTask: (taskId: string, validation?: any) => 
      completeTask(franchiseeId, taskId, validation),
    resetProgress: () => resetProgress(franchiseeId),
    updatePerformance: (performance: Partial<FranchiseePerformance>) =>
      updatePerformance(franchiseeId, performance),

    // Utilitários
    getNextLevelPoints: () => getNextLevelPoints(franchiseeId),
    getAvailableTasks: () => getAvailableTasks(franchiseeId),
    getTasksByCategory: (category: FranchiseeTask['category']) =>
      getTasksByCategory(franchiseeId, category),

    // Estado
    clearError
  };
};