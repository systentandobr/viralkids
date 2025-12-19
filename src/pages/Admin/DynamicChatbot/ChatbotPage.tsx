import React, { useState, useCallback } from 'react';
import { ChatbotPageProps } from './types';
import { useChatbotSession } from './hooks/useChatbotSession';
import { useChatMessages } from './hooks/useChatMessages';
import { ChatHeader } from './components/ChatHeader';
import { ChatMessages } from './components/ChatMessages';
import { ChatInput } from './components/ChatInput';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const ChatbotPage: React.FC<ChatbotPageProps> = ({
  defaultUnitId,
  className = '',
}) => {
  const { session, isLoading: sessionLoading, error: sessionError, unitId } =
    useChatbotSession({ defaultUnitId });

  const [currentRole, setCurrentRole] = useState<'assistant' | 'attendant' | null>(null);

  const handleError = useCallback((error: string) => {
    toast.error(error);
  }, []);

  const {
    messages,
    isLoading: messagesLoading,
    isSending,
    messagesEndRef,
    sendTextMessage,
    sendImageMessage,
    sendAudioMessage,
  } = useChatMessages({
    session,
    onError: handleError,
  });

  // Detectar role atual da última mensagem de resposta
  React.useEffect(() => {
    const lastResponse = [...messages]
      .reverse()
      .find((msg) => msg.role === 'assistant' || msg.role === 'attendant');
    if (lastResponse) {
      setCurrentRole(lastResponse.role === 'attendant' ? 'attendant' : 'assistant');
    }
  }, [messages]);

  const handleSendText = useCallback(
    (message: string) => {
      if (!session) {
        toast.error('Sessão não inicializada');
        return;
      }
      sendTextMessage(message, 'user');
    },
    [session, sendTextMessage]
  );

  const handleSendImage = useCallback(
    (file: File, base64: string, caption?: string) => {
      if (!session) {
        toast.error('Sessão não inicializada');
        return;
      }
      sendImageMessage(base64, 'base64', caption, 'user');
    },
    [session, sendImageMessage]
  );

  const handleSendAudio = useCallback(
    (audioBlob: Blob, base64: string, transcription?: string) => {
      if (!session) {
        toast.error('Sessão não inicializada');
        return;
      }
      sendAudioMessage(base64, 'base64', transcription, 'user');
    },
    [session, sendAudioMessage]
  );

  if (sessionLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Inicializando chat...</p>
        </div>
      </div>
    );
  }

  if (sessionError) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{sessionError}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center h-full">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Não foi possível inicializar a sessão</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${className}`}>
      <ChatHeader
        title="Assistente Virtual"
        currentRole={currentRole}
        isOnline={true}
      />

      <ChatMessages
        messages={messages}
        isLoading={messagesLoading || isSending}
        messagesEndRef={messagesEndRef}
      />

      <ChatInput
        onSendMessage={handleSendText}
        onSendImage={handleSendImage}
        onSendAudio={handleSendAudio}
        disabled={isSending || !session}
        placeholder="Digite sua mensagem..."
      />
    </div>
  );
};
