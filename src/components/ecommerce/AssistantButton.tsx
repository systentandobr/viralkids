import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, MessageCircle, X, Send } from "lucide-react";
import { Input } from "@/components/ui/input";

const AssistantButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Olá! 👋 Sou seu assistente virtual do Viral Kids. Como posso te ajudar hoje?",
      isBot: true,
      time: "agora"
    }
  ]);

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

  const quickQuestions = [
    "Como fazer um pedido?",
    "Quais são os prazos de entrega?",
    "Produtos personalizados 3D",
    "Como ser franqueado?"
  ];

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 z-50 animate-scale-in">
          <Card className="h-full flex flex-col shadow-2xl border-bronze/20">
            <CardHeader className="bg-gradient-to-r from-bronze to-gold text-white rounded-t-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bot className="h-5 w-5" />
                  <CardTitle className="text-sm font-medium">Assistente Viral Kids</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs opacity-90">Online agora</p>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg text-sm ${
                        msg.isBot
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-gradient-to-r from-bronze to-gold text-white'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <p className={`text-xs mt-1 ${msg.isBot ? 'text-gray-500' : 'text-white/70'}`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Questions */}
              <div className="p-3 border-t border-gray-100">
                <p className="text-xs text-muted-foreground mb-2">Perguntas frequentes:</p>
                <div className="grid grid-cols-2 gap-1">
                  {quickQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs h-7 justify-start px-2"
                      onClick={() => setMessage(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="p-3 border-t border-gray-100">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Digite sua mensagem..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 text-sm"
                  />
                  <Button
                    size="sm"
                    onClick={handleSendMessage}
                    className="bg-gradient-to-r from-bronze to-gold hover:from-bronze/90 hover:to-gold/90"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openWhatsApp}
                  className="w-full mt-2 text-xs border-green-500 text-green-600 hover:bg-green-50"
                >
                  <MessageCircle className="h-3 w-3 mr-1" />
                  Falar no WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-bronze to-gold hover:from-bronze/90 hover:to-gold/90 shadow-2xl z-50 animate-pulse-glow"
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