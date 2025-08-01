import React, { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  disabled = false,
  placeholder = "Digite sua mensagem..." 
}) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white rounded-b-2xl">
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex items-end space-x-3">
          {/* Input */}
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              disabled={disabled}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
              maxLength={500}
            />
            
            {/* Character count */}
            {message.length > 400 && (
              <div className="absolute -top-6 right-2 text-xs text-gray-500">
                {message.length}/500
              </div>
            )}
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={disabled || !message.trim()}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white p-3 rounded-xl transition-all duration-200 disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none"
            aria-label="Enviar mensagem"
          >
            {disabled ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 mt-3">
          <QuickActionButton
            onClick={() => onSendMessage('Quero saber sobre franquia')}
            disabled={disabled}
            icon="🏪"
            text="Franquia"
          />
          <QuickActionButton
            onClick={() => onSendMessage('Quero ver produtos')}
            disabled={disabled}
            icon="🧸"
            text="Produtos"
          />
          <QuickActionButton
            onClick={() => onSendMessage('Preciso de ajuda')}
            disabled={disabled}
            icon="❓"
            text="Ajuda"
          />
        </div>
      </form>
    </div>
  );
};

interface QuickActionButtonProps {
  onClick: () => void;
  disabled: boolean;
  icon: string;
  text: string;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  onClick,
  disabled,
  icon,
  text
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="inline-flex items-center space-x-1 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 disabled:text-gray-400 rounded-lg transition-colors disabled:cursor-not-allowed"
  >
    <span>{icon}</span>
    <span>{text}</span>
  </button>
);
