import React, { useState, useEffect } from 'react';
import TaskProgress from './TaskProgress';
import TaskCard from './TaskCard';

// Types (should be in a types file, but keeping here for MVP)
export interface Task {
    _id: string;
    id: string;
    name: string;
    description: string;
    category: string;
    status: 'pending' | 'in-progress' | 'completed' | 'skipped';
    progress: number;
    completedSteps: any[];
}

const TaskChecklist: React.FC<{ franchiseId: string }> = ({ franchiseId }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock fetch for now, replace with API call
        console.log('Fetching tasks for franchise', franchiseId);
        // simulate delay
        setTimeout(() => {
            setTasks([
                { _id: '1', id: '1', name: 'Configurar Automação', description: 'Setup inicial...', category: 'automation', status: 'pending', progress: 0, completedSteps: [] },
                { _id: '2', id: '2', name: 'WhatsApp Business', description: 'Configure seu número...', category: 'whatsapp', status: 'in-progress', progress: 50, completedSteps: [] },
            ]);
            setLoading(false);
        }, 1000);
    }, [franchiseId]);

    if (loading) return <div>Carregando tarefas...</div>;

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Checklist de Implantação</h2>
            <TaskProgress tasks={tasks} />
            <div className="mt-6 space-y-4">
                {tasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                ))}
            </div>
        </div>
    );
};

export default TaskChecklist;
