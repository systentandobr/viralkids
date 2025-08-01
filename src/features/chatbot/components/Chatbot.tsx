import React, { useEffect, useRef } from 'react';
import { useChatbot } from '../hooks/useChatbot';
import { formatTimestamp } from '../utils/helpers';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { QuickReplies } from './QuickReplies';
import { LoadingIndicator } from './LoadingIndicator';

interface ChatbotProps {
  className?: string;
  position?: 'fixed' | 'relative';
}

export const Chatbot: React.FC<ChatbotProps> = ({ 
  className = '', 
  position = 'fixed' 
}) => {
  const {
    isOpen,
    messages,
    isLoading,
    error,
    toggleChatbot,
    openChatbot,
    closeChatbot,
    processUserMessage,
    clearChat,
  } = useChatbot();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll para última mensagem
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Fechar com ESC
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        closeChatbot();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, closeChatbot]);

  const handleSendMessage = (message: string) => {
    if (message.trim()) {
      processUserMessage(message.trim());
    }
  };

  if (!isOpen && position === 'fixed') {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={openChatbot}
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 animate-pulse"
          aria-label="Abrir chat"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div
      className={`${
        position === 'fixed'
          ? 'fixed bottom-6 right-6 w-96 h-[600px] z-50'
          : 'w-full h-full'
      } ${className}`}
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-xl">🤖</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Viral Kids</h3>
                <p className="text-sm opacity-90">Assistente Virtual</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={clearChat}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="Limpar conversa"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              {position === 'fixed' && (
                <button
                  onClick={closeChatbot}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  title="Fechar chat"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
          style={{ maxHeight: 'calc(600px - 140px)' }}
        >
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              <div className="mb-4">
                <span className="text-4xl">👋</span>
              </div>
              <p className="text-lg font-medium mb-2">Olá! Bem-vindo à Viral Kids!</p>
              <p className="text-sm">
                Sou seu assistente virtual. Como posso te ajudar hoje?
              </p>
            </div>
          )}

          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              timestamp={formatTimestamp(message.timestamp)}
            />
          ))}

          {isLoading && <LoadingIndicator />}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        <QuickReplies onSelect={handleSendMessage} />

        {/* Input */}
        <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
};
