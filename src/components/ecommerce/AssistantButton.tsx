import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, MessageCircle, X, Send, Minimize2, Maximize2 } from "lucide-react";
import { Input } from "@/components/ui/input";

const AssistantButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "👋 Olá! Bem-vindo à Viral Kids!\n\nVi que você tem interesse em conhecer nossa oportunidade de franquia. Que incrível! ✨\n\nVou te fazer algumas perguntas rápidas para entender melhor seu perfil e te ajudar da melhor forma.",
      isBot: true,
      time: "agora"
    }
  ]);

  // Detectar se é mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto fullscreen no mobile quando abrir o chat
  useEffect(() => {
    if (isOpen && isMobile) {
      setIsFullscreen(true);
    }
  }, [isOpen, isMobile]);

  // Prevenir scroll do body quando fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isFullscreen]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      text: message,
      isBot: false,
      time: "agora"
    };

    setMessages(prev => [...prev, newUserMessage]);
    setMessage("");

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: "Obrigado pela sua mensagem! Nossa equipe de atendimento entrará em contato em breve. Para um atendimento mais rápido, recomendo falar diretamente no WhatsApp! 😊",
        isBot: true,
        time: "agora"
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/5584999999999?text=Olá! Preciso de ajuda com os produtos do Viral Kids!', '_blank');
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsFullscreen(false);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const quickQuestions = [
    "🏪 Quero ser franqueado",
    "📦 Ver produtos",
    "❓ Preciso de ajuda",
    "📞 Falar com consultor"
  ];

  // Classe condicional para fullscreen
  const chatContainerClass = isFullscreen 
    ? "fixed inset-0 z-50 animate-scale-in"
    : "fixed bottom-24 right-6 w-80 h-96 z-50 animate-scale-in";

  const cardClass = isFullscreen
    ? "h-full w-full flex flex-col shadow-2xl border-bronze/20 rounded-none"
    : "h-full flex flex-col shadow-2xl border-bronze/20";

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className={chatContainerClass}>
          <Card className={cardClass}>
            <CardHeader className="bg-gradient-to-r from-bronze to-gold text-white rounded-t-lg p-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bot className="h-5 w-5" />
                  <CardTitle className="text-md font-medium">Assistente Viral Kids</CardTitle>
                </div>
                <div className="flex items-center space-x-2">
                  {/* Botão de fullscreen (apenas no desktop) */}
                  {!isMobile && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleFullscreen}
                      className="text-white hover:bg-white/20 h-6 w-6 p-0"
                    >
                      {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                    className="text-white hover:bg-white/20 h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-xs opacity-90">Online agora • Resposta rápida</p>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-0 min-h-0">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-lg text-sm ${
                        msg.isBot
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-gradient-to-r from-bronze to-gold text-white'
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.text}</p>
                      <p className={`text-xs mt-1 ${msg.isBot ? 'text-gray-500' : 'text-white/70'}`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Questions */}
              <div className="p-3 border-t border-gray-100 flex-shrink-0">
                <p className="text-xs text-muted-foreground mb-2">Respostas rápidas:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className={`text-xs justify-start px-2 ${
                        isFullscreen ? 'h-10' : 'h-8'
                      }`}
                      onClick={() => setMessage(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="p-3 border-t border-gray-100 flex-shrink-0">
                <div className="flex space-x-2 mb-3">
                  <Input
                    placeholder="Digite sua mensagem..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className={`flex-1 text-sm ${isFullscreen ? 'h-12' : ''}`}
                  />
                  <Button
                    size={isFullscreen ? "default" : "sm"}
                    onClick={handleSendMessage}
                    className="bg-gradient-to-r from-bronze to-gold hover:from-bronze/90 hover:to-gold/90"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button
                  variant="outline"
                  size={isFullscreen ? "default" : "sm"}
                  onClick={openWhatsApp}
                  className="w-full text-xs border-green-500 text-green-600 hover:bg-green-50"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Continuar no WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-bronze to-gold hover:from-bronze/90 hover:to-gold/90 shadow-2xl z-40 animate-pulse-glow"
        size="lg"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Bot className="h-6 w-6" />
        )}
      </Button>
    </>
  );
};

export default AssistantButton;