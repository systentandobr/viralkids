import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Instagram, Mail, MapPin, Clock, Star, Bot } from "lucide-react";
import { useChatbot } from "@/features/chatbot/hooks/useChatbot";

const Contact = () => {
  const { openChatbot } = useChatbot();

  const openInstagram = () => {
    window.open('https://instagram.com/viral.kids', '_blank');
  };

  const contactMethods = [
    {
      icon: Bot,
      title: "Assistente Virtual",
      description: "Atendimento inteligente 24/7",
      action: "Falar com Assistente",
      info: "Chatbot IA",
      onClick: openChatbot,
      color: "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700",
      available: "24/7"
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      description: "Atendimento direto e personalizado",
      action: "Iniciar Conversa",
      info: "(84) 98741-4238",
      onClick: () => window.open('https://wa.me/5584987414238?text=Olá! Gostaria de mais informações sobre o Viral Kids!', '_blank'),
      color: "bg-green-500 hover:bg-green-600",
      available: "Online agora"
    },
    {
      icon: Instagram,
      title: "Instagram",
      description: "Novidades e produtos em destaque",
      action: "Seguir @viral.kids",
      info: "@viral.kids",
      onClick: openInstagram,
      color: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
      available: "Sempre ativo"
    },
    {
      icon: Mail,
      title: "E-mail",
      description: "Para dúvidas e parcerias",
      action: "Enviar E-mail",
      info: "contato@viralkids.com.br",
      onClick: () => window.open('mailto:contato@viralkids.com.br'),
      color: "bg-bronze hover:bg-bronze-dark",
      available: "24h"
    }
  ];

  const regions = [
    {
      state: "Rio Grande do Norte",
      cities: ["Natal", "Mossoró", "Parnamirim", "Caicó"],
      franqueados: 8
    },
    {
      state: "Pernambuco",
      cities: ["Recife", "Petrolina", "Caruaru", "Olinda"],
      franqueados: 12
    },
    {
      state: "Ceará",
      cities: ["Fortaleza", "Itapipoca", "Sobral", "Juazeiro do Norte"],
      franqueados: 5
    }
  ];

  const testimonials = [
    {
      name: "Maria Silva",
      location: "Natal/RN",
      role: "Mãe e Cliente",
      comment: "Produtos incríveis! Meu filho adora os brinquedos personalizados.",
      rating: 5
    },
    {
      name: "João Santos",
      location: "Petrolina/PE",
      role: "Franqueado",
      comment: "Melhor decisão que tomei. Negócio lucrativo e com propósito.",
      rating: 5
    },
    {
      name: "Ana Costa",
      location: "Fortaleza/CE",
      role: "Cliente Fiel",
      comment: "Atendimento excepcional e produtos únicos no mercado.",
      rating: 5
    }
  ];

  return (
    <section id="contato" className="py-20 bg-gradient-to-b from-background to-bronze/5">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <Badge className="bg-bronze/10 text-bronze border-bronze/20 hover:bg-bronze/20">
            💬 Fale Conosco
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">
            Estamos Prontos para
            <span className="text-transparent bg-gradient-hero bg-clip-text"> Ajudar</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Escolha o canal de sua preferência. Nossa equipe está sempre disponível 
            para esclarecer dúvidas e ajudar você a começar.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <Card key={index} className="group hover:shadow-bronze transition-all duration-300 hover:-translate-y-2 bg-gradient-card border-bronze/20">
                <CardContent className="p-6 text-center">
                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg ${method.color} text-white w-fit mx-auto shadow-bronze transition-all duration-300`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        {method.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {method.description}
                      </p>
                      <p className="text-sm font-medium text-bronze">
                        {method.info}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full inline-block">
                        {method.available}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full group-hover:bg-bronze group-hover:text-white group-hover:border-bronze"
                        onClick={method.onClick}
                      >
                        {method.action}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Regions Coverage */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Cobertura Regional
            </h3>
            <p className="text-muted-foreground">
              Atendemos todo o Nordeste com franqueados locais
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {regions.map((region, index) => (
              <Card key={index} className="bg-gradient-card border-bronze/20 hover:shadow-bronze transition-all duration-300">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold text-foreground">
                        {region.state}
                      </h4>
                      <Badge variant="secondary" className="text-xs">
                        {region.franqueados} franqueados
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      {region.cities.map((city, cityIndex) => (
                        <div key={cityIndex} className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-2 text-bronze" />
                          {city}
                        </div>
                      ))}
                    </div>

                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => window.open('https://wa.me/5584987414238?text=Olá! Gostaria de mais informações sobre o Viral Kids!', '_blank')}
                    >
                      <MessageCircle className="h-4 w-4" />
                      Atendimento Local
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              O que Nossos Clientes Dizem
            </h3>
            <p className="text-muted-foreground">
              Mais de 500 famílias satisfeitas em todo o Nordeste
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gradient-card border-bronze/20 hover:shadow-bronze transition-all duration-300">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                      ))}
                    </div>
                    
                    <p className="text-muted-foreground italic">
                      "{testimonial.comment}"
                    </p>
                    
                    <div className="border-t border-bronze/20 pt-4">
                      <p className="font-semibold text-foreground">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role} • {testimonial.location}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Operating Hours */}
        <div className="text-center bg-gradient-card rounded-2xl p-8 shadow-card border border-bronze/20 mb-16">
          <Clock className="h-8 w-8 text-bronze mx-auto mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-4">
            Horários de Atendimento
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <p className="font-medium text-foreground">WhatsApp & Instagram</p>
              <p>Segunda a Sábado: 8h às 20h</p>
              <p>Domingo: 9h às 17h</p>
            </div>
            <div>
              <p className="font-medium text-foreground">Telefone & E-mail</p>
              <p>Segunda a Sexta: 8h às 18h</p>
              <p>E-mail: 24h (resposta em até 4h)</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center bg-gradient-hero rounded-2xl p-8 shadow-glow text-white">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Vamos Conversar?
          </h3>
          <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
            Seja para fazer um pedido, se tornar franqueado ou tirar dúvidas, 
            estamos aqui para ajudar você a transformar sonhos em realidade.
          </p>
          <Button 
            variant="secondary" 
            size="lg"
            onClick={openChatbot}
            className="bg-white text-bronze hover:bg-white/90 group"
          >
            <Bot className="h-5 w-5 group-hover:animate-pulse" />
            Falar com nosso Assistente
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Contact;