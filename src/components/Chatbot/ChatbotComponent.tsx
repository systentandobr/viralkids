import React, { useState, useEffect } from 'react';
import { Send, User, Bot, Sparkles, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface ChatbotWindowProps {
    domain?: string;
    attendanceType?: 'capture' | 'sales' | 'support' | 'post-sales' | string;
    tone?: 'humanized' | 'calm' | 'fast' | string;
    leadId?: string;
    unitId?: string;
    stage?: string;
}

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export const ChatbotWindow = ({
    domain = 'default',
    attendanceType = 'support',
    tone = 'humanized',
    leadId,
    unitId
}: ChatbotWindowProps) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Initial welcome message based on configuration
    useEffect(() => {
        let welcomeText = "";

        // Customize welcome message based on type and tone
        switch (attendanceType) {
            case 'sales':
                welcomeText = tone === 'fast'
                    ? "Olá! Como posso ajudar você a fechar negócio hoje?"
                    : "Olá! Seja bem-vindo. Estou aqui para entender suas necessidades e encontrar a melhor solução para você.";
                break;
            case 'capture':
                welcomeText = "Olá! Gostaria de saber mais sobre nossos serviços?";
                break;
            case 'post-sales':
                welcomeText = "Olá! Como está sendo sua experiência? Posso ajudar em algo mais?";
                break;
            default:
                welcomeText = "Olá! Como posso ajudar você hoje?";
        }

        setMessages([
            {
                id: 'welcome',
                role: 'assistant',
                content: welcomeText,
                timestamp: new Date()
            }
        ]);
    }, [attendanceType, tone]);

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const newUserMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newUserMessage]);
        setInputValue("");
        setIsLoading(true);

        // Simulate response delay
        setTimeout(() => {
            const responseText = `[Simulação] Resposta do bot (${tone}) para o domínio ${domain}. 
      Entendi que você disse: "${newUserMessage.content}". 
      (Contexto: Tipo=${attendanceType}, Lead=${leadId || 'N/A'}, Unit=${unitId || 'N/A'})`;

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: responseText,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMessage]);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="flex flex-col h-full w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            {/* Header */}
            <div className="p-4 border-b flex items-center gap-3 bg-secondary/20">
                <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                        <Bot className="h-6 w-6 text-white" />
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>
                </div>
                <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        Assistente Virtual
                        <Sparkles className="h-4 w-4 text-purple-500 animate-pulse" />
                    </h3>
                    <p className="text-xs text-muted-foreground flex gap-2">
                        <span className="capitalize">{attendanceType}</span> •
                        <span className="capitalize">{tone}</span>
                    </p>
                </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4 max-w-3xl mx-auto">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'
                                }`}
                        >
                            {msg.role === 'assistant' && (
                                <Avatar className="h-8 w-8 mt-1 border border-border">
                                    <AvatarImage src="/bot-avatar.png" />
                                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                                        <Bot className="h-4 w-4" />
                                    </AvatarFallback>
                                </Avatar>
                            )}

                            <div
                                className={`rounded-2xl p-4 max-w-[80%] shadow-sm ${msg.role === 'user'
                                    ? 'bg-purple-600 text-white rounded-tr-none'
                                    : 'bg-muted/50 border border-border rounded-tl-none'
                                    }`}
                            >
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                <span className={`text-[10px] mt-1 block opacity-70 ${msg.role === 'user' ? 'text-purple-100' : 'text-muted-foreground'
                                    }`}>
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>

                            {msg.role === 'user' && (
                                <Avatar className="h-8 w-8 mt-1 border border-purple-200">
                                    <AvatarFallback className="bg-purple-100 text-purple-700">
                                        <User className="h-4 w-4" />
                                    </AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex gap-3 justify-start">
                            <Avatar className="h-8 w-8 mt-1">
                                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                                    <Bot className="h-4 w-4" />
                                </AvatarFallback>
                            </Avatar>
                            <div className="bg-muted/50 border border-border rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
                                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t bg-background">
                <div className="max-w-3xl mx-auto flex gap-2">
                    <Input
                        placeholder="Digite sua mensagem..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1 bg-muted/30 focus-visible:ring-purple-500"
                    />
                    <Button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isLoading}
                        className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
                <div className="text-center mt-2">
                    <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        Chatbot powered by Systentando AI
                    </p>
                </div>
            </div>
        </div>
    );
};
