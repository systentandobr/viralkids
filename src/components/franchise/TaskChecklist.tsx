import React, { useState, useEffect } from 'react';
import TaskProgress from './TaskProgress';
import TaskCard from './TaskCard';
import { franchiseTasksService, FranchiseTask } from '@/services/api/franchise-tasks.service';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
// import { useAuthStore } from '@/stores/auth.store'; // Assuming we need user ID for initialization

const TaskChecklist: React.FC<{ franchiseId: string }> = ({ franchiseId }) => {
    const { toast } = useToast();
    const [tasks, setTasks] = useState<FranchiseTask[]>([]);
    const [loading, setLoading] = useState(true);
    const [initializing, setInitializing] = useState(false);

    useEffect(() => {
        if (franchiseId) {
            fetchTasks();
        }
    }, [franchiseId]);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const response = await franchiseTasksService.findAllByFranchise(franchiseId);
            if (response.success && response.data) {
                setTasks(response.data);
            }
        } catch (error) {
            console.error("Error fetching tasks", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInitialize = async () => {
        setInitializing(true);
        try {
            // value for userId should come from auth context normally found in `useAuthStore` or passed as prop
            // For now, let's assume the backend handles it or we send a placeholder if backend extracts from token
            // The service method expects (franchiseId, userId). 
            // If we don't have userId handy here, we might need to get it.
            // Let's try to get it from a store or assumption.
            // As a fallback, we can pass "current" if backend supports extracting from Token.
            // But the service signature is `initializeDefaults(franchiseId, userId)`.
            // Let's import useAuthStore properly if possible.

            const { useAuthStore } = await import('@/stores/auth.store');
            const user = useAuthStore.getState().user;

            if (!user) {
                toast({ title: "Erro", description: "Usuário não identificado.", variant: "destructive" });
                return;
            }

            const response = await franchiseTasksService.initializeDefaults(franchiseId, user.id);
            if (response.success) {
                toast({ title: "Sucesso", description: "Tarefas iniciais configuradas!" });
                fetchTasks();
            } else {
                toast({ title: "Erro", description: response.error || "Falha ao inicializar tarefas.", variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Erro", description: "Erro ao inicializar.", variant: "destructive" });
        } finally {
            setInitializing(false);
        }
    };

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-blue-500" /></div>;

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Checklist de Implantação</h2>
                <Button variant="outline" size="sm" onClick={fetchTasks}><RefreshCw className="h-4 w-4" /></Button>
            </div>

            {tasks.length > 0 ? (
                <>
                    <TaskProgress tasks={tasks} />
                    <div className="mt-6 space-y-4">
                        {tasks.map(task => (
                            <TaskCard key={task._id || task.id} task={task} />
                        ))}
                    </div>
                </>
            ) : (
                <div className="text-center py-8 space-y-4">
                    <p className="text-gray-500">Nenhuma tarefa encontrada para esta unidade.</p>
                    <Button onClick={handleInitialize} disabled={initializing}>
                        {initializing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Inicializar Tarefas Padrão
                    </Button>
                    <p className="text-xs text-gray-400">Clique para carregar o checklist de onboarding.</p>
                </div>
            )}
        </div>
    );
};

export default TaskChecklist;
