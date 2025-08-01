import { useState, useEffect, useCallback } from 'react';
import { FranchiseeTask, TaskCategory, Badge, FranchiseePerformance } from '../types';

interface UseGameificationOptions {
  franchiseeId: string;
}

interface GameificationState {
  tasks: FranchiseeTask[];
  completedTasks: FranchiseeTask[];
  currentTask: FranchiseeTask | null;
  performance: FranchiseePerformance;
  badges: Badge[];
  level: number;
  totalPoints: number;
  progress: number;
  isLoading: boolean;
  error: string | null;
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
    ]
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
    }
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
    ]
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
    }
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
    }
  }
];

export const useGameification = ({ franchiseeId }: UseGameificationOptions) => {
  const [state, setState] = useState<GameificationState>({
    tasks: [],
    completedTasks: [],
    currentTask: null,
    performance: {
      totalSales: 0,
      monthlyTarget: 5000,
      achievedTarget: false,
      averageTicket: 0,
      customerCount: 0,
      tasksCompleted: 0,
      totalTasks: 0,
      score: 0,
      level: 1,
      badges: []
    },
    badges: [],
    level: 1,
    totalPoints: 0,
    progress: 0,
    isLoading: false,
    error: null
  });

  // Carregar dados do localStorage ou API
  useEffect(() => {
    loadGameificationData();
  }, [franchiseeId]);

  // Calcular progresso sempre que as tarefas mudarem
  useEffect(() => {
    updateProgress();
  }, [state.tasks, state.completedTasks]);

  const loadGameificationData = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Tentar carregar do localStorage primeiro
      const savedData = localStorage.getItem(`gameification_${franchiseeId}`);
      
      if (savedData) {
        const data = JSON.parse(savedData);
        
        // Converter datas de volta para objetos Date
        const processedData = {
          ...data,
          badges: data.badges?.map((badge: any) => ({
            ...badge,
            earnedAt: new Date(badge.earnedAt)
          })) || [],
          completedTasks: data.completedTasks?.map((task: any) => ({
            ...task,
            dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
            completedAt: task.completedAt ? new Date(task.completedAt) : undefined
          })) || [],
          tasks: data.tasks?.map((task: any) => ({
            ...task,
            dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
            completedAt: task.completedAt ? new Date(task.completedAt) : undefined
          })) || []
        };
        
        setState(prev => ({
          ...prev,
          ...processedData,
          isLoading: false
        }));
      } else {
        // Inicializar com tarefas padrão
        setState(prev => ({
          ...prev,
          tasks: DEFAULT_TASKS.map(task => ({
            ...task,
            status: task.dependencies ? 'pending' : 'pending'
          })),
          performance: {
            ...prev.performance,
            totalTasks: DEFAULT_TASKS.length
          },
          isLoading: false
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar dados de gamificação:', error);
      setState(prev => ({
        ...prev,
        error: 'Erro ao carregar dados de gamificação',
        isLoading: false
      }));
    }
  }, [franchiseeId]);

  const updateProgress = useCallback(() => {
    setState(prev => {
      const completedCount = prev.completedTasks.length;
      const totalCount = prev.tasks.length + prev.completedTasks.length;
      const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
      
      const totalPoints = prev.completedTasks.reduce((sum, task) => sum + task.points, 0);
      const level = calculateLevel(totalPoints);
      
      return {
        ...prev,
        progress,
        totalPoints,
        level,
        performance: {
          ...prev.performance,
          tasksCompleted: completedCount,
          totalTasks: totalCount,
          score: totalPoints,
          level
        }
      };
    });
  }, []);

  const calculateLevel = (points: number): number => {
    for (let i = LEVEL_POINTS.length - 1; i >= 0; i--) {
      if (points >= LEVEL_POINTS[i]) {
        return i + 1;
      }
    }
    return 1;
  };

  const completeTask = useCallback(async (taskId: string, validation?: any) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const taskIndex = state.tasks.findIndex(t => t.id === taskId);
      if (taskIndex === -1) {
        throw new Error('Tarefa não encontrada');
      }
      
      const task = { ...state.tasks[taskIndex] };
      task.status = 'completed';
      task.completedAt = new Date();
      
      // Remover da lista de tarefas pendentes
      const newTasks = state.tasks.filter(t => t.id !== taskId);
      
      // Adicionar à lista de tarefas completas
      const newCompletedTasks = [...state.completedTasks, task];
      
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
      const newBadges = checkForNewBadges(newCompletedTasks, state.badges);
      
      const newState = {
        ...state,
        tasks: unlockedTasks,
        completedTasks: newCompletedTasks,
        badges: [...state.badges, ...newBadges],
        isLoading: false
      };
      
      setState(newState);
      
      // Salvar no localStorage
      saveGameificationData(newState);
      
      // Mostrar notificação de conquista
      if (newBadges.length > 0) {
        showBadgeNotification(newBadges);
      }
      
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Erro ao completar tarefa',
        isLoading: false
      }));
    }
  }, [state, franchiseeId]);

  const checkForNewBadges = (completedTasks: FranchiseeTask[], currentBadges: Badge[]): Badge[] => {
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
  };

  const showBadgeNotification = (badges: Badge[]) => {
    // TODO: Implementar sistema de notificações
    console.log('Novas badges conquistadas:', badges);
  };

  const saveGameificationData = (data: any) => {
    try {
      localStorage.setItem(`gameification_${franchiseeId}`, JSON.stringify({
        tasks: data.tasks,
        completedTasks: data.completedTasks,
        badges: data.badges,
        performance: data.performance,
        level: data.level,
        totalPoints: data.totalPoints,
        progress: data.progress
      }));
    } catch (error) {
      console.error('Erro ao salvar dados de gamificação:', error);
    }
  };

  const resetProgress = useCallback(() => {
    setState({
      tasks: DEFAULT_TASKS,
      completedTasks: [],
      currentTask: null,
      performance: {
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
      },
      badges: [],
      level: 1,
      totalPoints: 0,
      progress: 0,
      isLoading: false,
      error: null
    });
    
    localStorage.removeItem(`gameification_${franchiseeId}`);
  }, [franchiseeId]);

  const getNextLevelPoints = (): number => {
    const currentLevel = state.level;
    if (currentLevel >= LEVEL_POINTS.length) {
      return LEVEL_POINTS[LEVEL_POINTS.length - 1];
    }
    return LEVEL_POINTS[currentLevel] - state.totalPoints;
  };

  const getAvailableTasks = (): FranchiseeTask[] => {
    return state.tasks.filter(task => task.status === 'pending');
  };

  const getTasksByCategory = (category: TaskCategory): FranchiseeTask[] => {
    return [...state.tasks, ...state.completedTasks].filter(task => task.category === category);
  };

  return {
    // Estado
    tasks: state.tasks,
    completedTasks: state.completedTasks,
    currentTask: state.currentTask,
    performance: state.performance,
    badges: state.badges,
    level: state.level,
    totalPoints: state.totalPoints,
    progress: state.progress,
    isLoading: state.isLoading,
    error: state.error,
    
    // Ações
    completeTask,
    resetProgress,
    
    // Utilitários
    getNextLevelPoints,
    getAvailableTasks,
    getTasksByCategory,
  };
};
