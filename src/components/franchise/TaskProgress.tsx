import React from 'react';
import { Task } from './TaskChecklist';

interface TaskProgressProps {
    tasks: Task[];
}

const TaskProgress: React.FC<TaskProgressProps> = ({ tasks }) => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    return (
        <div>
            <div className="flex justify-between text-sm mb-1">
                <span>Progresso Geral</span>
                <span>{percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${percentage}%` }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">{completed} de {total} tarefas concluídas</p>
        </div>
    );
};

export default TaskProgress;
