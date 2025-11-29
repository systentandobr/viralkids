import React from 'react';

interface QuickRepliesProps {
  onSelect: (message: string) => void;
  replies?: Array<{
    id: string;
    text: string;
    payload: string;
  }>;
}

export const QuickReplies: React.FC<QuickRepliesProps> = ({ 
  onSelect, 
  replies = [] 
}) => {
  // Se não há quick replies específicas, mostrar sugestões padrão
  const defaultReplies = [
    { id: 'franchise', text: '🏪 Quero ser franqueado', payload: 'franchise' },
    { id: 'products', text: '🧸 Ver produtos', payload: 'products' },
    { id: 'help', text: '❓ Preciso de ajuda', payload: 'help' },
  ];

  const currentReplies = replies.length > 0 ? replies : defaultReplies;

  if (currentReplies.length === 0) {
    return null;
  }

  return (
    <div className="px-4 pb-2">
      <div className="flex flex-wrap gap-2">
        {currentReplies.map((reply) => (
          <button
            key={reply.id}
            onClick={() => onSelect(reply.text)}
            className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200 text-pink-700 text-base rounded-lg border border-pink-200 hover:border-pink-300 transition-all duration-200 transform hover:scale-105"
          >
            {reply.text}
          </button>
        ))}
      </div>
    </div>
  );
};
