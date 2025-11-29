import React from 'react';

interface LoadingIndicatorProps {
  message?: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  message = "Digitando..." 
}) => {
  return (
    <div className="flex justify-start mb-4">
      <div className="flex items-center space-x-3">
        {/* Avatar do bot */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0">
          🤖
        </div>

        {/* Indicador de digitação */}
        <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2">
            <span className="text-gray-600 text-base">{message}</span>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
      <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
      <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
    </div>
  );
};

export const ProcessingIndicator: React.FC = () => {
  return (
    <div className="flex items-center justify-center space-x-2 text-gray-500">
      <div className="w-4 h-4 border-2 border-gray-300 border-t-pink-500 rounded-full animate-spin" />
      <span className="text-base">Processando...</span>
    </div>
  );
};
