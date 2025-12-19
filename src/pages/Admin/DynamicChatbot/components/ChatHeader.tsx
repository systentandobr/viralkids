import React from 'react';
import { Bot, Headphones, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ChatHeaderProps {
  title?: string;
  currentRole?: 'assistant' | 'attendant' | null;
  isOnline?: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  title = 'Assistente Virtual',
  currentRole = null,
  isOnline = true,
}) => {
  return (
    <div className="p-4 border-b flex items-center gap-3 bg-secondary/20">
      <div className="relative">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
            currentRole === 'attendant'
              ? 'bg-blue-500'
              : 'bg-gradient-to-br from-purple-500 to-pink-500'
          }`}
        >
          {currentRole === 'attendant' ? (
            <Headphones className="h-6 w-6 text-white" />
          ) : (
            <Bot className="h-6 w-6 text-white" />
          )}
        </div>
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>
        )}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          {title}
          <Sparkles className="h-4 w-4 text-purple-500 animate-pulse" />
        </h3>
        <div className="flex items-center gap-2">
          {currentRole === 'attendant' && (
            <Badge
              variant="outline"
              className="text-xs bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300"
            >
              Atendente Humano
            </Badge>
          )}
          {currentRole === 'assistant' && (
            <Badge
              variant="outline"
              className="text-xs bg-purple-500/10 border-purple-500/30 text-purple-700 dark:text-purple-300"
            >
              Assistente Virtual
            </Badge>
          )}
          {!currentRole && (
            <p className="text-xs text-muted-foreground">
              {isOnline ? 'Online' : 'Offline'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
