import React from 'react';
import { ChatMessage } from '../types';
import { User, Bot, Headphones } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface MessageBubbleProps {
  message: ChatMessage;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const isAttendant = message.role === 'attendant';
  const isAssistant = message.role === 'assistant';

  return (
    <div
      className={`flex gap-3 ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`flex gap-3 max-w-[80%] ${
          isUser ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        {/* Avatar */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            isUser
              ? 'bg-purple-500'
              : isAttendant
              ? 'bg-blue-500'
              : 'bg-gradient-to-br from-purple-500 to-pink-500'
          }`}
        >
          {isUser ? (
            <User className="h-4 w-4 text-white" />
          ) : isAttendant ? (
            <Headphones className="h-4 w-4 text-white" />
          ) : (
            <Bot className="h-4 w-4 text-white" />
          )}
        </div>

        {/* Message Content */}
        <div
          className={`rounded-lg p-3 ${
            isUser
              ? 'bg-purple-500/20 border border-purple-500/30'
              : isAttendant
              ? 'bg-blue-500/20 border border-blue-500/30'
              : 'bg-muted border border-border'
          }`}
        >
          {/* Image Preview */}
          {message.type === 'image' && (
            <div className="mb-2">
              {message.metadata?.imageUrl ? (
                <img
                  src={message.metadata.imageUrl}
                  alt="Imagem enviada"
                  className="max-w-full max-h-64 rounded-lg"
                />
              ) : message.metadata?.imageBase64 ? (
                <img
                  src={`data:image/jpeg;base64,${message.metadata.imageBase64}`}
                  alt="Imagem enviada"
                  className="max-w-full max-h-64 rounded-lg"
                />
              ) : null}
            </div>
          )}

          {/* Audio Player */}
          {message.type === 'audio' && (
            <div className="mb-2">
              <audio
                controls
                className="w-full"
                src={
                  message.metadata?.audioUrl ||
                  (message.metadata?.audioBase64
                    ? `data:audio/webm;base64,${message.metadata.audioBase64}`
                    : '')
                }
              >
                Seu navegador não suporta áudio.
              </audio>
            </div>
          )}

          {/* Text Content */}
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          </div>

          {/* Footer with timestamp and badge */}
          <div className="flex items-center justify-between gap-2 mt-1">
            <p className="text-xs text-muted-foreground">
              {format(message.timestamp, 'HH:mm')}
            </p>
            {isAttendant && (
              <Badge
                variant="outline"
                className="text-xs bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300"
              >
                Atendente
              </Badge>
            )}
            {isAssistant && (
              <Badge
                variant="outline"
                className="text-xs bg-purple-500/10 border-purple-500/30 text-purple-700 dark:text-purple-300"
              >
                Assistente
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
