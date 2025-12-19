import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, User, Bot, Calendar, Headphones } from "lucide-react";
import { ConversationSession } from "@/services/chatbot/conversationService";
import { format } from "date-fns";

interface ConversationHistoryProps {
  sessions: ConversationSession[];
  isLoading?: boolean;
  error?: Error | null;
}

export const ConversationHistory = ({
  sessions,
  isLoading,
  error,
}: ConversationHistoryProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Carregando histórico...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <p className="text-red-600">
            Erro ao carregar histórico: {error.message}
          </p>
        </div>
      </div>
    );
  }

  if (!sessions || sessions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">Nenhuma conversa encontrada</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <Card key={session.sessionId} className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Sessão: {session.sessionId}</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {session.firstMessageAt &&
                  format(new Date(session.firstMessageAt), "dd/MM/yyyy HH:mm")}
              </div>
              <Badge variant="outline" className="text-xs">
                {session.messageCount} mensagens
              </Badge>
            </div>
          </div>

          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {session.history && session.history.length > 0 ? (
                session.history.map((message, index) => {
                  const isUser = message.role === "user";
                  const isAttendant = message.role === "attendant";
                  const isAssistant = message.role === "assistant";
                  
                  return (
                    <div
                      key={index}
                      className={`flex gap-3 ${
                        isUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`flex gap-3 max-w-[80%] ${
                          isUser ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isUser
                              ? "bg-purple-500"
                              : isAttendant
                              ? "bg-blue-500"
                              : "bg-gradient-to-br from-purple-500 to-pink-500"
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
                        <div
                          className={`rounded-lg p-3 ${
                            isUser
                              ? "bg-purple-500/20 border border-purple-500/30"
                              : isAttendant
                              ? "bg-blue-500/20 border border-blue-500/30"
                              : "bg-muted border border-border"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          </div>
                          <div className="flex items-center justify-between gap-2 mt-1">
                            {message.timestamp && (
                              <p className="text-xs text-muted-foreground">
                                {format(new Date(message.timestamp), "HH:mm")}
                              </p>
                            )}
                            {isAttendant && (
                              <Badge variant="outline" className="text-xs bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300">
                                Atendente
                              </Badge>
                            )}
                            {isAssistant && (
                              <Badge variant="outline" className="text-xs bg-purple-500/10 border-purple-500/30 text-purple-700 dark:text-purple-300">
                                Assistente
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhuma mensagem disponível nesta sessão
                </p>
              )}
            </div>
          </ScrollArea>
        </Card>
      ))}
    </div>
  );
};



