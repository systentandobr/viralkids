import React from 'react';
import { Task } from './TaskChecklist';

interface TaskCardProps {
    task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
    return (
        <div className="border rounded-md p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="font-semibold text-lg">{task.name}</h3>
                    <p className="text-sm text-gray-500">{task.description}</p>
                </div>
                <div>
                    <span className={`px-2 py-1 rounded text-xs font-semibold
                ${task.status === 'completed' ? 'bg-green-100 text-green-800' :
                            task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'}`}>
                        {task.status === 'completed' ? 'Concluído' :
                            task.status === 'in-progress' ? 'Em Progresso' : 'Pendente'}
                    </span>
                </div>
            </div>
            <div className="mt-2 text-right">
                <button className="text-blue-600 text-sm hover:underline">Ver detalhes</button>
            </div>
        </div>
    );
};

export default TaskCard;
