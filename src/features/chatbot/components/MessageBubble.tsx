import React from 'react';
import { ChatMessage } from '../types';

interface MessageBubbleProps {
  message: ChatMessage;
  timestamp: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, timestamp }) => {
  const isBot = message.sender === 'bot';
  
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`flex max-w-[80%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 ${isBot ? 'mr-3' : 'ml-3'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isBot 
              ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white' 
              : 'bg-gray-300 text-gray-600'
          }`}>
            {isBot ? '🤖' : '👤'}
          </div>
        </div>

        {/* Message Content */}
        <div className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}>
          <div className={`rounded-2xl px-4 py-3 max-w-full break-words ${
            isBot
              ? 'bg-white text-gray-800 shadow-sm border border-gray-100'
              : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
          }`}>
            {/* Renderizar mensagem com formatação */}
            <div className="whitespace-pre-wrap">
              {formatMessageText(message.text)}
            </div>
            
            {/* Timestamp */}
            <div className={`text-xs mt-2 opacity-70 ${
              isBot ? 'text-gray-500' : 'text-white/70'
            }`}>
              {timestamp}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Função para formatar texto da mensagem
const formatMessageText = (text: string): React.ReactNode => {
  // Substituir variáveis de template
  let formattedText = text;
  
  // Dividir por quebras de linha
  const lines = formattedText.split('\n');
  
  return lines.map((line, index) => (
    <React.Fragment key={index}>
      {formatLine(line)}
      {index < lines.length - 1 && <br />}
    </React.Fragment>
  ));
};

const formatLine = (line: string): React.ReactNode => {
  // Negrito **texto**
  if (line.includes('**')) {
    const parts = line.split('**');
    return parts.map((part, index) => 
      index % 2 === 1 ? <strong key={index}>{part}</strong> : part
    );
  }
  
  // Itálico *texto*
  if (line.includes('*') && !line.includes('**')) {
    const parts = line.split('*');
    return parts.map((part, index) => 
      index % 2 === 1 ? <em key={index}>{part}</em> : part
    );
  }
  
  // Código `texto`
  if (line.includes('`')) {
    const parts = line.split('`');
    return parts.map((part, index) => 
      index % 2 === 1 ? (
        <code key={index} className="bg-gray-100 px-1 py-0.5 rounded text-sm">
          {part}
        </code>
      ) : part
    );
  }
  
  return line;
};
