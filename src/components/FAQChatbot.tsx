import React, { useState } from 'react';
import { useNavigation } from '../stores/additional/navigation.store';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  MessageCircle, 
  X, 
  Search, 
  ChevronDown, 
  ChevronUp,
  Send,
  HelpCircle
} from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
}

const FAQ_DATA: FAQItem[] = [
  {
    id: '1',
    question: 'Como funciona a entrega?',
    answer: 'Nossa entrega é feita em até 3 dias úteis para todo o Brasil. O frete é grátis para compras acima de R$ 99,90.',
    category: 'Entrega',
    tags: ['entrega', 'frete', 'prazo']
  },
  {
    id: '2',
    question: 'Posso trocar o produto?',
    answer: 'Sim! Você tem 30 dias para trocar qualquer produto, desde que esteja em perfeito estado e na embalagem original.',
    category: 'Trocas',
    tags: ['troca', 'devolução', 'garantia']
  },
  {
    id: '3',
    question: 'Como escolher o tamanho correto?',
    answer: 'Use nosso guia de tamanhos disponível em cada produto. Ele inclui uma régua eletrônica para medições precisas.',
    category: 'Tamanhos',
    tags: ['tamanho', 'medida', 'guia']
  },
  {
    id: '4',
    question: 'Os produtos são originais?',
    answer: 'Sim! Todos os nossos produtos são 100% originais, com garantia do fabricante e certificados de autenticidade.',
    category: 'Qualidade',
    tags: ['original', 'autêntico', 'garantia']
  },
  {
    id: '5',
    question: 'Como funciona o pagamento?',
    answer: 'Aceitamos cartões de crédito, PIX, boleto bancário e transferência. Parcelamos em até 12x sem juros.',
    category: 'Pagamento',
    tags: ['pagamento', 'cartão', 'pix', 'parcela']
  }
];

export const FAQChatbot: React.FC = () => {
  const { isChatbotOpen, setChatbotOpen, saveSearch } = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

  // Filtrar FAQs baseado na busca
  const filteredFAQs = FAQ_DATA.filter(faq => {
    const matchesSearch = searchTerm === '' || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'Todas' || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Categorias únicas
  const categories = ['Todas', ...Array.from(new Set(FAQ_DATA.map(faq => faq.category)))];

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      saveSearch(searchTerm, filteredFAQs, { type: 'faq' });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (!isChatbotOpen) {
    return (
      <Button
        onClick={() => setChatbotOpen(true)}
        className="fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 shadow-lg"
        size="lg"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-h-[600px] bg-white rounded-lg shadow-xl border">
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg">Central de Ajuda</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setChatbotOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Busca */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar perguntas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 pr-10"
              />
              <Button
                size="sm"
                onClick={handleSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Filtro por categoria */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Lista de FAQs */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <HelpCircle className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>Nenhuma pergunta encontrada</p>
                <p className="text-base">Tente outros termos de busca</p>
              </div>
            ) : (
              filteredFAQs.map(faq => (
                <div key={faq.id} className="border rounded-lg">
                  <button
                    onClick={() => toggleExpanded(faq.id)}
                    className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50"
                  >
                    <span className="font-medium text-base">{faq.question}</span>
                    {expandedItems.includes(faq.id) ? (
                      <ChevronUp className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                  
                  {expandedItems.includes(faq.id) && (
                    <div className="px-4 pb-4">
                      <p className="text-base text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                      <div className="flex gap-1 mt-2">
                        {faq.tags.map(tag => (
                          <span
                            key={tag}
                            className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Contato adicional */}
          <div className="pt-4 border-t">
            <p className="text-base text-gray-600 text-center">
              Não encontrou o que procurava?
            </p>
            <Button className="w-full mt-2" variant="outline">
              Falar com Atendente
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 