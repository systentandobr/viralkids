import React, { useState, useRef, useEffect } from 'react';
import { Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// Emojis categorizados
const EMOJI_CATEGORIES = {
  'Frequentemente usados': ['😀', '😂', '😍', '🥰', '😎', '🤔', '👍', '❤️', '🔥', '✨'],
  'Pessoas': ['👋', '🙏', '👏', '💪', '🤝', '👨', '👩', '👶', '👴', '👵'],
  'Animais': ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯'],
  'Comida': ['🍎', '🍌', '🍇', '🍊', '🍓', '🥑', '🍕', '🍔', '🍟', '🌮'],
  'Atividades': ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸'],
  'Viagem': ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '✈️'],
  'Objetos': ['⌚', '📱', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🗜️'],
  'Símbolos': ['❤️', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️'],
};

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  disabled?: boolean;
}

export const EmojiPicker: React.FC<EmojiPickerProps> = ({
  onEmojiSelect,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(
    Object.keys(EMOJI_CATEGORIES)[0]
  );

  const filteredEmojis = React.useMemo(() => {
    if (!searchTerm) {
      return EMOJI_CATEGORIES[selectedCategory as keyof typeof EMOJI_CATEGORIES] || [];
    }

    // Buscar em todos os emojis
    const allEmojis = Object.values(EMOJI_CATEGORIES).flat();
    return allEmojis.filter((emoji) => emoji.includes(searchTerm));
  }, [searchTerm, selectedCategory]);

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={disabled}
          className="h-8 w-8 p-0"
        >
          <Smile className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-2">
          {/* Search */}
          <input
            type="text"
            placeholder="Buscar emoji..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border rounded-md mb-2 text-sm"
          />

          {/* Categories */}
          {!searchTerm && (
            <div className="flex gap-1 mb-2 overflow-x-auto">
              {Object.keys(EMOJI_CATEGORIES).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-2 py-1 text-xs rounded ${
                    selectedCategory === category
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

          {/* Emojis Grid */}
          <div className="grid grid-cols-8 gap-1 max-h-64 overflow-y-auto">
            {filteredEmojis.map((emoji, index) => (
              <button
                key={`${emoji}-${index}`}
                onClick={() => handleEmojiClick(emoji)}
                className="text-2xl hover:bg-muted rounded p-1 transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
